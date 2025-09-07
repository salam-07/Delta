import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow localhost and any IP on local network
            const allowedOrigins = [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/,  // 192.168.x.x:5173
                /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:5173$/,  // 10.x.x.x:5173
                /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}:5173$/  // 172.16-31.x.x:5173
            ];

            const isAllowed = allowedOrigins.some(allowedOrigin => {
                if (typeof allowedOrigin === 'string') {
                    return origin === allowedOrigin;
                } else {
                    return allowedOrigin.test(origin);
                }
            });

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
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
