const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001','https://santa-cruz-kappa.vercel.app/'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/temp'));
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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const photoRoutes = require('./routes/photos');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes);

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Root diagnostic route - will be helpful to check if server is running at all
app.get('/', (req, res) => {
  res.json({
    message: 'Santa Cruz Archive API is running',
    apiRoutes: [
      '/api/test - Basic test endpoint',
      '/api/healthcheck - Health check endpoint',
      '/api/photos - Photos API',
      '/api/photos/debug - Photos API debug endpoint',
      '/api/admin - Admin API'
    ],
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Add a more comprehensive healthcheck endpoint
app.get('/api/healthcheck', (req, res) => {
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
  
  res.json({
    ...healthData,
    status: 'OK',
    message: 'Service is healthy'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message || 'Something went wrong on the server' 
  });
});

// In production, serve the frontend from the build directory
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - serving static files from build directory');
  
  // Serve static files from the React build directory (one level up from server)
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  // For any routes that don't start with /api/, serve the React app
  app.get('*', (req, res, next) => {
    // Skip API routes and let them be handled by the API route handlers
    if (req.path.startsWith('/api/')) {
      return next();
    }
    console.log(`Serving React app for path: ${req.path}`);
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB connected: ${mongoose.connection.readyState === 1}`);
});

module.exports = app; 