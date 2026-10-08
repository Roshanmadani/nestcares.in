const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing.');
    }
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    global.dbConnected = true;
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Kept for /api/health; strip anything that looks like a connection string or credentials
    global.dbLastError = String(error.message || 'Unknown error')
      .replace(/mongodb(\+srv)?:\/\/[^\s]+/gi, 'mongodb://<hidden>')
      .slice(0, 300);
    console.log('Server will run using JSON File Database Fallback (under backend/data/) for development stability!');
    isConnected = false;
    global.dbConnected = false;
  }
};

module.exports = { connectDB, isConnected: () => isConnected };
