import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('CRITICAL ERROR: MONGO_URI environment variable is missing!');
    process.exit(1);
  }

  // Set up production Mongoose connection settings
  const connectionOptions = {
    maxPoolSize: 10,                 // Safe threshold for MongoDB Atlas M0 free tier
    serverSelectionTimeoutMS: 30000,  // Fail fast if connection is unreachable (30 seconds)
  };

  // Mongoose Connection Lifecycle Listeners
  mongoose.connection.on('connected', () => {
    console.log(`[Database] Mongoose successfully connected to cluster host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (error) => {
    console.error(`[Database] Mongoose active connection error: ${error.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] Mongoose disconnected from MongoDB. Attempting auto-reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Database] Mongoose successfully reconnected to MongoDB Atlas');
  });

  // Attempt initial connection
  try {
    await mongoose.connect(mongoUri, connectionOptions);
  } catch (error) {
    console.error(`[Database] Mongoose initial database handshake failed: ${error.message}`);
    process.exit(1);
  }
};

// Graceful Database Connection Closure
const gracefulShutdown = async (signal) => {
  console.log(`[Process] Received signal ${signal}. Commencing graceful server teardown...`);
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('[Database] Mongoose connection closed successfully. Safe socket termination complete.');
    }
    process.exit(0);
  } catch (error) {
    console.error(`[Database] Failure encountered during graceful Mongoose connection teardown: ${error.message}`);
    process.exit(1);
  }
};

// Register system event signal interception
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default connectDB;
