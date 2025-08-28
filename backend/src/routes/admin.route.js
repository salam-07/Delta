import express from "express";

// controller functions
import { createStock, showUsers } from "../controllers/admin.controller.js";
// admin only route checking
import { adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// create a new stock
router.post("/create", adminRoute, createStock);
router.get("/users", adminRoute, showUsers);


export default router;