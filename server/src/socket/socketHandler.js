const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

const initializeSocket = (io) => {
  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('firstName lastName avatar role');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User connected: ${userId} (socket: ${socket.id})`);

    // Join user's personal room for targeted notifications
    socket.join(`user:${userId}`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast online status
    io.emit('user_online', { userId });

    // ==================
    // Chat Events
    // ==================

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicator
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing_start', {
        userId,
        conversationId,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing_stop', {
        userId,
        conversationId,
      });
    });

    // Message read receipt
    socket.on('message_read', ({ conversationId, messageId }) => {
      socket.to(`conversation:${conversationId}`).emit('message_read', {
        userId,
        conversationId,
        messageId,
      });
    });

    // ==================
    // Get online users
    // ==================
    socket.on('get_online_users', (userIds, callback) => {
      const online = userIds.filter((id) => onlineUsers.has(id));
      if (typeof callback === 'function') {
        callback(online);
      }
    });

    // ==================
    // Disconnect
    // ==================
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId} (socket: ${socket.id})`);

      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit('user_offline', { userId });
        }
      }
    });
  });

  return io;
};

module.exports = { initializeSocket, onlineUsers };
