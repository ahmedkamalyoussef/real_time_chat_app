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
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", async (socket) => {
  console.log(`User ${socket.id} connected`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  const friendsIds = await getFriendsIds(userId);

  const onlineUsers = Object.keys(userSocketMap);

  const onlineFriends = onlineUsers.filter(
    (id) => id !== userId && friendsIds.includes(id)
  );

  io.to(socket.id).emit("getOnlineUsers", onlineFriends);

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
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
