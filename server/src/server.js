require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const referralRoutes = require('./routes/referralRoutes');
const companyRoutes = require('./routes/companyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Parse allowed origins from CLIENT_URL (comma-separated)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Make io accessible to routes
app.set('io', io);

// Initialize socket handlers
initializeSocket(io);

// =========================
// Middleware
// =========================
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

// =========================
// API Routes
// =========================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/jobs', apiLimiter, jobRoutes);
app.use('/api/referrals', apiLimiter, referralRoutes);
app.use('/api/companies', apiLimiter, companyRoutes);
app.use('/api/messages', apiLimiter, messageRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Job Referral Platform API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use(errorHandler);

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis (optional)
    await connectRedis();

    server.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║   Job Referral Platform API Server           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   Port: ${PORT}                                ║
║   MongoDB: Connected                         ║
║   Socket.io: Ready                           ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
