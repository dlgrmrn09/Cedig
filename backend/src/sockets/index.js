import { Server } from 'socket.io';
import admin from '../lib/firebase.js';
import config from '../config/index.js';
import { SOCKET_EVENTS } from '../constants/index.js';
import * as userRepository from '../repositories/userRepository.js';

let io = null;
const onlineUsers = new Map();

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ['websocket', 'polling'],
  });

  io.use(async (socket, next) => {
    try {
      console.log('[SOCKET] Auth attempt:', { transport: socket.conn.transport?.name, query: !!socket.handshake.query?.token });

      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        console.log('[SOCKET] Auth rejected: no token');
        return next(new Error('Authentication required'));
      }

      let userId;
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await userRepository.findByFirebaseUid(decodedToken.uid);
        if (!user) {
          console.log('[SOCKET] Auth rejected: user not found for uid:', decodedToken.uid);
          return next(new Error('User not found'));
        }
        userId = user.id;
        socket.userRole = user.role;
        socket.userName = user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email;
      } catch (verifyErr) {
        console.log('[SOCKET] Auth rejected: token verification failed:', verifyErr.message);
        return next(new Error('Invalid token'));
      }

      socket.userId = userId;
      console.log('[SOCKET] Auth success:', { userId });
      next();
    } catch (err) {
      console.error('[SOCKET] Auth error:', err.message);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`[SOCKET] Connected: user ${userId}`);

    onlineUsers.set(userId, { socketId: socket.id, userId, userName: socket.userName });
    socket.join(`user:${userId}`);
    io.emit(SOCKET_EVENTS.USER_ONLINE, { userId, userName: socket.userName });

    socket.on('join:tree', (treeId) => {
      if (treeId) socket.join(`tree:${treeId}`);
    });

    socket.on('leave:tree', (treeId) => {
      if (treeId) socket.leave(`tree:${treeId}`);
    });

    socket.on('notification:mark-read', async (notificationId) => {
      try {
        const { markAsRead } = await import('../services/notificationService.js');
        await markAsRead(notificationId, userId);
        emitToUser(userId, 'notification:updated', { id: notificationId, isRead: true });
      } catch (err) {
        console.error('[SOCKET] mark-read error:', err.message);
      }
    });

    socket.on('notification:mark-all-read', async () => {
      try {
        const { markAllAsRead } = await import('../services/notificationService.js');
        await markAllAsRead(userId);
        emitToUser(userId, 'notifications:read-all', {});
      } catch (err) {
        console.error('[SOCKET] mark-all-read error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
      console.log(`[SOCKET] Disconnected: user ${userId}`);
    });
  });

  console.log('[SOCKET] Initialized');
  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitToUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}

export function emitToTree(treeId, event, data) {
  if (io) io.to(`tree:${treeId}`).emit(event, data);
}

export function getOnlineUsers() {
  return Array.from(onlineUsers.values());
}
