// API index route
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  return res.status(200).json({
    message: 'Santa Cruz Archive API',
    version: '1.0',
    endpoints: [
      { method: 'GET', path: '/api/photos', description: 'Get photos with optional status and floorId filters' },
      { method: 'GET', path: '/api/healthcheck', description: 'Check API health status' },
      { method: 'GET', path: '/api/debug', description: 'View debug information' }
    ],
    status: 'online',
    timestamp: new Date().toISOString()
  });
} 