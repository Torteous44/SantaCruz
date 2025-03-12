const { connectToDatabase } = require('./utils/db');
const Photo = require('./models/Photo');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  // Handle GET requests (fetching photos)
  if (req.method === 'GET') {
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
      
      const photos = await Photo.find(filter).sort({ submittedAt: -1 });
      console.log(`Found ${photos.length} photos matching the criteria`);
      
      return res.status(200).json(photos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      return res.status(500).json({ error: 'Server error fetching photos' });
    }
  }
  
  // Handle POST requests (upload a new photo)
  else if (req.method === 'POST') {
    // Note: File uploads require different handling in serverless functions
    // For now, we'll return an error
    return res.status(501).json({ 
      error: 'Photo uploads not implemented in serverless function yet',
      message: 'Please use the Express server for file uploads'
    });
  }
  
  // Return 405 Method Not Allowed for other HTTP methods
  else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 