import express from "express";

// controller functions
import { buy, sell, viewStock, viewAllStocks, checkBalance } from "../controllers/trade.controller.js";
// admin only route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// create a new stock
router.post("/buy", protectRoute, buy);
router.post("/sell", protectRoute, sell);

router.get("/balance", protectRoute, checkBalance);

router.get("/view", protectRoute, viewAllStocks);
router.get("/view/:ticker", protectRoute, viewStock);

export default router;