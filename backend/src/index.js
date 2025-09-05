// package imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// local imports
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import tradeRoutes from "./routes/trade.route.js";
import marketRoutes from "./routes/market.route.js";

// .env 
dotenv.config();
const PORT = process.env.PORT;

// express app instance
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
// cors policy for dev - allow local network access
app.use(cors(
    {
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
));

// routes
app.use("/api/auth", authRoutes); // routes for auth
app.use("/api/admin", adminRoutes); // admin only routes. Update, add stocks and dev etc.
app.use("/api/trade", tradeRoutes); // endpoints for buying and selling stocks, viewnng balance, portfolio and history
app.use("/api/market", marketRoutes); //market related routes. View devs, stocks and prices.

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    connectDB();
});