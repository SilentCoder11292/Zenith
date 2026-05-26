import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import AppError from './shared/utils/AppError.js';
import globalErrorHandler from './shared/middlewares/errorHandler.js';

const app = express();

// ==========================================
// 1. GLOBAL SECURITY & SYSTEM MIDDLEWARES
// ==========================================

// Enforce standard HTTP headers security using Helmet
app.use(helmet());

// Dynamic environment HTTP requests logging via Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global API rate limiting to shield Gemini and MongoDB Atlas operations
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute sliding window
  limit: 100,               // Allow up to 100 requests per IP per window windowMs
  message: {
    status: 'fail',
    message: 'Too many requests from this IP endpoint, please attempt retry in 15 minutes.'
  },
  standardHeaders: true,    // Return standardized rate limit information headers
  legacyHeaders: false,     // Deprecate legacy headers
});

// Restrict rate limiting only to API paths
app.use('/api', apiRateLimiter);

// Enable Cross-Origin Resource Sharing for future React integration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Robust body parsers with safety limits to shield against large-payload vector attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================================
// 2. SYSTEM STATUS ROUTES
// ==========================================

// Centralized Systems Engine Health-Check Router
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Zenith Business Incubation Engine is fully online.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// 3. FALLBACK ROUTE & GLOBAL ERROR HANDLER
// ==========================================

// Intercept all unmatched HTTP requests with clean 404 Operational AppErrors
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} does not exist on this application server.`, 404));
});

// Final Express error propagation handler pipeline
app.use(globalErrorHandler);

export default app;
