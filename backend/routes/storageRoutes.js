import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getStorageStats } from "../controllers/storageController.js";

const router = express.Router();

router.get("/", protect, getStorageStats);

export default router;