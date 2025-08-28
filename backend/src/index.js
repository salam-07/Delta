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

// .env 
dotenv.config();
const PORT = process.env.PORT;

// express app instance
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
// cors policy for dev
// app.use(cors(
//     {
//         origin: "http://localhost:5173",
//         credentials: true
//     }
// ));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    connectDB();
});