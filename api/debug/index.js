const mongoose = require('mongoose');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: {
      environment: process.env.VERCEL_ENV || 'not-vercel',
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown',
    },
    mongoStatus: mongoose.connection.readyState,
    mongoReadyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    apiEndpoints: [
      { method: 'GET', path: '/api/photos', description: 'Get all photos with optional filters' },
      { method: 'GET', path: '/api/healthcheck', description: 'Check API health status' },
      { method: 'GET', path: '/api/debug', description: 'This debug endpoint' }
    ],
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
  };
  
  return res.status(200).json(debugInfo);
} 