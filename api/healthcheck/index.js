const { connectToDatabase } = require('../utils/db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Try to connect to database
    await connectToDatabase();
    
    const healthData = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
      mongodbConnected: mongoose.connection.readyState === 1,
      apiVersion: '1.0',
      serverTime: new Date().toISOString()
    };
    
    console.log('Health check performed:', healthData);
    
    if (!healthData.mongodbConnected) {
      return res.status(503).json({
        ...healthData,
        status: 'Service Unavailable',
        message: 'Database connection is not established'
      });
    }
    
    return res.status(200).json({
      ...healthData,
      status: 'OK',
      message: 'Service is healthy'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      timestamp: Date.now(),
      status: 'Error',
      message: 'Health check failed',
      error: error.message
    });
  }
} 