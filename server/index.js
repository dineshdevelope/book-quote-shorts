import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import morgan from 'morgan';
import dotenv from 'dotenv';


// Load env vars
dotenv.config();

// Import routes
import quoteRoutes from './routes/quoteRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Import database connection
import connectDatabase from './config/connectDB.js';

// Connect to database
connectDatabase();
// Add sample data if database is empty


const app = express();

// Security headers
app.use(helmet());

// Rate limiting - Convert string to number
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection


// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/quotes', quoteRoutes);
app.use('/api/auth', authRoutes);

// Handle unhandled routes - FIXED: Use a proper path
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler middleware - should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;