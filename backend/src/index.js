// package imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// local imports
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import tradeRoutes from "./routes/trade.route.js";
import marketRoutes from "./routes/market.route.js";

// .env 
dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT;

// Note: app is now imported from socket.js instead of created here

// middleware
app.use(express.json());
app.use(cookieParser());
// cors policy for dev - allow local network access
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

// routes
app.use("/api/auth", authRoutes); // routes for auth
app.use("/api/admin", adminRoutes); // admin only routes. Update, add stocks and dev etc.
app.use("/api/trade", tradeRoutes); // endpoints for buying and selling stocks, viewnng balance, portfolio and history
app.use("/api/market", marketRoutes); //market related routes. View devs, stocks and prices.

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
    connectDB();
});