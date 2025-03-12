const mongoose = require('mongoose');

// Track connection status
let isConnected = false;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase() {
  // If already connected, use existing connection
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1; // 1 = connected
    console.log('MongoDB connected successfully');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 