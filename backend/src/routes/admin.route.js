import express from "express";

// controller functions
import { createStock, showUsers, updatePrice, newDevelopment, editDevelopment, deleteDevelopment, deleteStock } from "../controllers/admin.controller.js";
// admin only route checking
import { adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// create a new stock
router.post("/create", adminRoute, createStock);
router.put("/update", adminRoute, updatePrice);
router.delete("/deletestock", adminRoute, deleteStock);


router.get("/users", adminRoute, showUsers);

router.post("/new", adminRoute, newDevelopment);
router.put("/edit/:id", adminRoute, editDevelopment);
router.delete("/delete/:id", adminRoute, deleteDevelopment);


export default router;