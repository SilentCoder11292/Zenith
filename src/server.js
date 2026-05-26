// Initialize dotenv environment configuration at the absolute top of the stack
import 'dotenv/config';
import connectDB from './shared/config/db.js';
import app from './app.js';

// 1. REGISTER UNCAUGHT EXCEPTION SAFEGUARDS
// Trap synchronous execution failures before booting any runtime elements
process.on('uncaughtException', (error) => {
  console.error('[CRITICAL SYSTEM EXCEPTION] Synchronous uncaught exception detected! Shutting down process immediately...', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// 2. ORCHESTRATE SERVER BOOTSTRAP
const bootstrap = async () => {
  // Initialize MongoDB connection via central manager
  await connectDB();

  // Bind and listen to network requests
  const server = app.listen(PORT, () => {
    console.log(`[Server] Zenith Business Engine online on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
  });

  // 3. REGISTER UNHANDLED PROMISE REJECTION SAFEGUARDS
  // Gracefully close active Express sockets prior to shutting down on unhandled rejections
  process.on('unhandledRejection', (error) => {
    console.error('[CRITICAL ASYNC REJECTION] Unhandled promise rejection detected! Closing server gracefully...', error);
    server.close(() => {
      console.log('[Server] Active HTTP listeners successfully closed. Terminating process...');
      process.exit(1);
    });
  });
};

bootstrap();
