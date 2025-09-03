import express from "express";

import {
    viewMarketIndex,
    viewAllStocks,
    viewStock,
    viewAllDevelopments,
    viewDevelopment
} from "../controllers/market.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/viewstocks", protectRoute, viewAllStocks);
router.get("/viewstock/:id", protectRoute, viewStock);

router.get("/viewdevs", protectRoute, viewAllDevelopments);
router.get("/viewdev/:id", protectRoute, viewDevelopment);

export default router;