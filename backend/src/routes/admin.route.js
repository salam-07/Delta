import express from "express";

// controller functions
import { createStock, showUsers, updatePrice } from "../controllers/admin.controller.js";
// admin only route checking
import { adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// create a new stock
router.post("/create", adminRoute, createStock);
router.put("/update", adminRoute, updatePrice);
router.get("/users", adminRoute, showUsers);


export default router;