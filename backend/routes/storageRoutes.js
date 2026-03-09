import express from "express";
import { getStorageStats } from "../controllers/storageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: Storage usage APIs
 */

/**
 * @swagger
 * /api/storage:
 *   get:
 *     summary: Get storage usage
 *     tags: [Storage]
 */
router.get("/", protect, getStorageStats);

export default router;