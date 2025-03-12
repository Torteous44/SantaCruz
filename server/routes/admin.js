const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// @route   GET /api/admin/photos/pending
// @desc    Get all pending photos
// @access  Admin (no auth implemented yet)
router.get('/photos/pending', async (req, res) => {
  try {
    const pendingPhotos = await Photo.find({ status: 'pending' })
      .sort({ submittedAt: -1 });
    
    res.json(pendingPhotos);
  } catch (err) {
    console.error('Error fetching pending photos:', err);
    res.status(500).json({ error: 'Server error fetching pending photos' });
  }
});

// @route   GET /api/admin/photos/stats
// @desc    Get statistics about photos (count by status)
// @access  Admin (no auth implemented yet)
router.get('/photos/stats', async (req, res) => {
  try {
    const pendingCount = await Photo.countDocuments({ status: 'pending' });
    const approvedCount = await Photo.countDocuments({ status: 'approved' });
    const rejectedCount = await Photo.countDocuments({ status: 'rejected' });
    
    res.json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: pendingCount + approvedCount + rejectedCount
    });
  } catch (err) {
    console.error('Error fetching photo stats:', err);
    res.status(500).json({ error: 'Server error fetching photo stats' });
  }
});

module.exports = router; 