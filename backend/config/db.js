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
      // Cold serverless starts need longer than 5s for DNS + TLS to Atlas
      serverSelectionTimeoutMS: 15000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    global.dbConnected = true;
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Kept for /api/health; strip anything that looks like a connection string or credentials
    // Server selection errors hide the real cause per server; surface it
    const serverReasons = [];
    const servers = error.reason?.servers;
    if (servers && typeof servers.forEach === 'function') {
      servers.forEach((desc, host) => {
        if (desc?.error) serverReasons.push(`${host}: ${desc.error.message || desc.error}`);
      });
    }
    const detail = serverReasons.length ? ` | ${serverReasons.slice(0, 2).join(' | ')}` : '';
    global.dbLastError = (String(error.name || 'Error') + ': ' + String(error.message || 'Unknown error') + detail)
      .replace(/mongodb(\+srv)?:\/\/[^\s]+/gi, 'mongodb://<hidden>')
      .slice(0, 600);
    console.log('Server will run using JSON File Database Fallback (under backend/data/) for development stability!');
    isConnected = false;
    global.dbConnected = false;
  }
};

module.exports = { connectDB, isConnected: () => isConnected };
