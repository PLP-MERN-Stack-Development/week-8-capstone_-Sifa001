require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/database');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const routeRoutes = require('./routes/routes');
const scheduleRoutes = require('./routes/schedules');
const userRoutes = require('./routes/users');
const passengerRoutes = require('./routes/passenger');
const departureRoutes = require('./routes/departures');
const stageRoutes = require('./routes/stages');
const notificationRoutes = require('./routes/notifications');
const driverRoutes = require('./routes/drivers');
const vehicleRoutes = require('./routes/vehicles');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'], // Allow both deployed and local frontends
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/departures', departureRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SafariTrack API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.user.name} (${socket.user.role}) connected`);

  // Join route-specific rooms
  socket.on('join-route', (routeId) => {
    socket.join(`route-${routeId}`);
    console.log(`User ${socket.user.name} joined route ${routeId}`);
  });

  // Leave route-specific rooms
  socket.on('leave-route', (routeId) => {
    socket.leave(`route-${routeId}`);
    console.log(`User ${socket.user.name} left route ${routeId}`);
  });

  // Handle real-time schedule updates
  socket.on('schedule-update', (data) => {
    socket.to(`route-${data.routeId}`).emit('schedule-updated', {
      ...data,
      user: {
        name: socket.user.name,
        role: socket.user.role
      },
      timestamp: new Date()
    });
  });

  // Handle driver location updates (for future implementation)
  socket.on('driver-location', (data) => {
    if (socket.user.role === 'driver') {
      socket.to(`route-${data.routeId}`).emit('driver-location-updated', {
        driverId: socket.user._id,
        location: data.location,
        scheduleId: data.scheduleId,
        timestamp: new Date()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.name} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;