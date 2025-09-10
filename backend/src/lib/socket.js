import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getFriendsIds } from "../utils/helpers.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3000",
      "https://chatty-f.up.railway.app",
      "https://chatty-prod.up.railway.app",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Periodic cleanup of disconnected users
setInterval(async () => {
  const connectedSockets = new Set();
  
  // Get all currently connected socket IDs
  for (const [socketId, socket] of io.sockets.sockets) {
    if (socket.connected) {
      connectedSockets.add(socketId);
    }
  }
  
  // Remove users whose sockets are no longer connected
  const usersToRemove = [];
  for (const [userId, socketId] of Object.entries(userSocketMap)) {
    if (!connectedSockets.has(socketId)) {
      usersToRemove.push(userId);
    }
  }
  
  // Remove disconnected users
  for (const userId of usersToRemove) {
    delete userSocketMap[userId];
    console.log(`Cleaned up disconnected user: ${userId}`);
  }
  
  // Update online friends for all remaining users if any users were removed
  if (usersToRemove.length > 0) {
    const onlineUsers = Object.keys(userSocketMap);
    
    for (const [currentUserId, currentSocketId] of Object.entries(userSocketMap)) {
      if (connectedSockets.has(currentSocketId)) {
        const friendsIds = await getFriendsIds(currentUserId);
        const onlineFriends = onlineUsers.filter(
          (id) => id !== currentUserId && friendsIds.includes(id)
        );
        io.to(currentSocketId).emit("getOnlineUsers", onlineFriends);
      }
    }
  }
}, 30000); // Run every 30 seconds

io.on("connection", async (socket) => {
  console.log(`User ${socket.id} connected`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Update online friends for all users when someone connects
  const updateOnlineFriendsForAll = async () => {
    const onlineUsers = Object.keys(userSocketMap);
    
    // Get all users and their friends
    for (const [currentUserId, currentSocketId] of Object.entries(userSocketMap)) {
      const friendsIds = await getFriendsIds(currentUserId);
      const onlineFriends = onlineUsers.filter(
        (id) => id !== currentUserId && friendsIds.includes(id)
      );
      io.to(currentSocketId).emit("getOnlineUsers", onlineFriends);
    }
  };

  // Update online friends for the newly connected user
  const friendsIds = await getFriendsIds(userId);
  const onlineUsers = Object.keys(userSocketMap);
  const onlineFriends = onlineUsers.filter(
    (id) => id !== userId && friendsIds.includes(id)
  );
  io.to(socket.id).emit("getOnlineUsers", onlineFriends);

  // Update online friends for all other users
  await updateOnlineFriendsForAll();

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${userId} left group ${groupId}`);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", async () => {
    console.log(`User ${socket.id} disconnected`);
    if (userId) {
      delete userSocketMap[userId];
    }
    // Update online friends for all remaining users
    await updateOnlineFriendsForAll();
  });
});

export { io, app, server };
