import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// Apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// Map: { userId: socketId } — for 1-on-1 targeting
const userSocketMap = {};

/**
 * Returns the socket ID of a connected user, or undefined if offline.
 * Used by controllers to target specific recipients.
 */
export function getReceiverSocketId(userId) {
  return userSocketMap[userId.toString()];
}

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("A user connected:", socket.user.fullName);

  userSocketMap[userId] = socket.id;

  // Broadcast updated online user list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ─── Group Room Management ──────────────────────────────────────────────────

  // Client emits this after fetching their groups so they receive group messages
  socket.on("joinGroups", (groupIds) => {
    if (!Array.isArray(groupIds)) return;
    groupIds.forEach((gid) => {
      socket.join(`group:${gid}`);
    });
  });

  // Client leaves a group room (optional, cleanup)
  socket.on("leaveGroup", (groupId) => {
    socket.leave(`group:${groupId}`);
  });

  // ─── Disconnect ─────────────────────────────────────────────────────────────

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
