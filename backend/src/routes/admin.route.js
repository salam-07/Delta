import express from "express";

// controller functions
import {
    createStock,
    updatePrice,
    deleteStock,
    newDevelopment,
    editDevelopment,
    deleteDevelopment,
    postDevelopment,
    showUsers,
    showTradingHistory
} from "../controllers/admin.controller.js";

// admin only route checking
import { adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// stocks management routes
router.post("/createstock", adminRoute, createStock);
router.put("/updatestock/:id", adminRoute, updatePrice);
router.delete("/deletestock/:id", adminRoute, deleteStock);

//development management routes
router.post("/createdev", adminRoute, newDevelopment);
router.put("/editdev/:id", adminRoute, editDevelopment);
router.delete("/deletedev/:id", adminRoute, deleteDevelopment);
router.put("/postdev/:id", adminRoute, postDevelopment);

// management related routes
router.get("/users", adminRoute, showUsers);
router.get("/tradehistory", adminRoute, showTradingHistory);

export default router;