// This file is necessary for Vercel deployments
// It serves the React build files in production
const path = require('path');
const express = require('express');

const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Fallback to index.html for all other routes
// This ensures client-side routing works
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    // Let the API routes handle API requests
    return res.status(404).json({ error: 'API route not found' });
  }
  
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Export for Vercel serverless deployment
module.exports = app; 