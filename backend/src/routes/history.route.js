import express from "express";

// controller functions
import { viewStockHistory } from "../controllers/history.controller.js";
// admin only route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// create a new stock
router.get("/:id", protectRoute, viewStockHistory);


export default router;