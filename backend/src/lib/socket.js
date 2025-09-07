import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

// Helper function to get socket ID by user ID
export function getUserSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {}; // userId -> socketId mapping

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Emit updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle stock price updates (admin only)
    socket.on("stockPriceUpdate", (data) => {
        // Broadcast to all connected clients except sender
        socket.broadcast.emit("stockPriceUpdated", data);
    });

    // Handle market status changes
    socket.on("marketStatusChange", (data) => {
        // Broadcast to all connected clients except sender
        socket.broadcast.emit("marketStatusChanged", data);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Find and remove user from mapping
        for (const [uid, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[uid];
                console.log(`User ${uid} disconnected`);
                break;
            }
        }

        // Emit updated online users list to all remaining clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Helper function to emit to specific user
export function emitToUser(userId, event, data) {
    const socketId = getUserSocketId(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
}

// Helper function to emit to all users
export function emitToAll(event, data) {
    io.emit(event, data);
}

export { io, app, server };
