import { Server } from "socket.io";
import http from "http";
import express from "express";

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
});

const userSocketMap = {};

// Global online users array for better performance
global.onlineUsers = [];

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;

    // Add user to global online users if not already there
    if (!global.onlineUsers.includes(userId)) {
      global.onlineUsers.push(userId);
    }

    // Emit online status to all connected clients
    io.emit("userOnline", userId);
  }

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${userId} left group ${groupId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    if (userId) {
      delete userSocketMap[userId];

      // Remove user from global online users
      global.onlineUsers = global.onlineUsers.filter((id) => id !== userId);

      // Emit offline status to all connected clients
      io.emit("userOffline", userId);
    }
  });
});

export { io, app, server };
