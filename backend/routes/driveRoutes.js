import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getRootDrive, getFolderContent } from "../controllers/driveController.js";

const router = express.Router();

router.get("/root", protect, getRootDrive);

router.get("/:folderId", protect, getFolderContent);

export default router;