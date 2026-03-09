import express from "express";
import {
  createFolder,
  getFolders,
  getFolderSize
} from "../controllers/folderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: Folder management APIs
 */

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 */
router.post("/", protect, createFolder);

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Get all folders
 *     tags: [Folders]
 */
router.get("/", protect, getFolders);

/**
 * @swagger
 * /api/folders/size/{folderId}:
 *   get:
 *     summary: Get folder size recursively
 *     tags: [Folders]
 */
router.get("/size/:folderId", protect, getFolderSize);

export default router;