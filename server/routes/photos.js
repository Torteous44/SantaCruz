const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Photo = require('../models/Photo');
const cloudflare = require('../utils/cloudflare');
const mongoose = require('mongoose');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/temp'));
  },
  filename: function(req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter for multer to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// @route   POST /api/photos/upload
// @desc    Upload a new photo
// @access  Public
router.post('/upload', upload.single('imageFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { contributor, floorId, roomId } = req.body;

    if (!contributor || !floorId) {
      return res.status(400).json({ 
        error: 'Please provide contributor name and floor ID' 
      });
    }

    // Format date as "Mon YYYY"
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    // Create metadata for Cloudflare
    const metadata = JSON.stringify({
      contributor,
      floorId,
      roomId: roomId || '',
      date
    });

    // Get temporary file path
    const tempFilePath = path.join(__dirname, '../uploads/temp', req.file.filename);
    
    // Upload image to Cloudflare
    const cloudflareResponse = await cloudflare.uploadImage(tempFilePath, metadata);
    
    if (!cloudflareResponse.success) {
      throw new Error('Failed to upload image to Cloudflare');
    }
    
    const cloudflareId = cloudflareResponse.result.id;
    const imageUrl = cloudflare.getImageUrl(cloudflareId);

    // Create new photo entry in database
    const newPhoto = new Photo({
      contributor,
      date,
      floorId,
      roomId: roomId || undefined,
      tempFilePath: `/uploads/temp/${req.file.filename}`,
      cloudflareId,
      imageUrl,
      originalFileName: req.file.originalname,
      status: 'pending'
    });

    await newPhoto.save();

    res.status(201).json({ 
      message: 'Photo uploaded and pending approval',
      photo: newPhoto
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// @route   GET /api/photos
// @desc    Get all photos (with optional status filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, floorId } = req.query;
    
    console.log(`GET /api/photos request received with params:`, { status, floorId });
    
    // Build filter object
    const filter = {};
    
    // Only add status to filter if it's provided
    if (status) {
      filter.status = status;
    }
    
    // Only add floorId to filter if it's provided
    if (floorId) {
      filter.floorId = floorId;
    }

    console.log('MongoDB filter:', filter);
    console.log('MongoDB URI:', process.env.MONGODB_URI.substring(0, 20) + '...');
    
    const photos = await Photo.find(filter).sort({ submittedAt: -1 });
    console.log(`Found ${photos.length} photos matching the criteria`);
    
    res.json(photos);
  } catch (err) {
    console.error('Error fetching photos:', err);
    res.status(500).json({ error: 'Server error fetching photos' });
  }
});

// @route   GET /api/photos/debug
// @desc    Debug endpoint to check API accessibility
// @access  Public
router.get('/debug', (req, res) => {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      apiEndpoint: '/api/photos',
      availableEndpoints: [
        { method: 'GET', path: '/api/photos', description: 'Get all photos with optional filters' },
        { method: 'GET', path: '/api/photos/debug', description: 'This debug endpoint' },
        { method: 'POST', path: '/api/photos/upload', description: 'Upload a new photo' }
      ],
      serverInfo: {
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    
    res.json(debugInfo);
  } catch (err) {
    console.error('Error in debug endpoint:', err);
    res.status(500).json({ error: 'Error in debug endpoint', message: err.message });
  }
});

// @route   PUT /api/photos/:id/approve
// @desc    Approve a photo
// @access  Admin (no auth implemented yet)
router.put('/:id/approve', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    if (photo.status === 'approved') {
      return res.status(400).json({ error: 'Photo already approved' });
    }
    
    // Update the photo record
    photo.status = 'approved';
    photo.approvedAt = new Date();
    
    await photo.save();
    
    // Clean up temp file if it exists
    if (photo.tempFilePath) {
      const filePath = path.join(__dirname, '..', photo.tempFilePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        photo.tempFilePath = undefined;
        await photo.save();
      }
    }
    
    res.json({ 
      message: 'Photo approved successfully',
      photo
    });
  } catch (err) {
    console.error('Error approving photo:', err);
    res.status(500).json({ error: 'Server error approving photo' });
  }
});

// @route   PUT /api/photos/:id/reject
// @desc    Reject a photo
// @access  Admin (no auth implemented yet)
router.put('/:id/reject', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    if (photo.status === 'rejected') {
      return res.status(400).json({ error: 'Photo already rejected' });
    }
    
    // Delete the image from Cloudflare
    if (photo.cloudflareId) {
      try {
        await cloudflare.deleteImage(photo.cloudflareId);
      } catch (cloudflareErr) {
        console.error('Failed to delete from Cloudflare:', cloudflareErr);
        // Continue even if Cloudflare deletion fails
      }
    }
    
    // Delete the temp file if it exists
    if (photo.tempFilePath) {
      const filePath = path.join(__dirname, '..', photo.tempFilePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Update the photo record
    photo.status = 'rejected';
    photo.tempFilePath = undefined;
    
    await photo.save();
    
    res.json({ 
      message: 'Photo rejected successfully',
      photo
    });
  } catch (err) {
    console.error('Error rejecting photo:', err);
    res.status(500).json({ error: 'Server error rejecting photo' });
  }
});

module.exports = router; 