const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const { handleMulterError } = require('./src/middleware/upload');

const app = express();

// Database connection
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting - increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased to 1000 requests per windowMs for development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/recipes', require('./src/routes/recipes'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/areas', require('./src/routes/areas'));
app.use('/api/ingredients', require('./src/routes/ingredients'));
app.use('/api/testimonials', require('./src/routes/testimonials'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Foodies API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(handleMulterError);
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`);
});