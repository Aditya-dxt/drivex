import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadFile,
  getFiles,
  downloadFile,
  previewFile,
  deleteFile,
  shareFile,
  searchFiles,
  renameFile,
  moveFile,
  copyFile,
  getTrashFiles,
  restoreFile,
  permanentDeleteFile,
  getActivity,
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);

router.get("/", protect, getFiles);

router.get("/download/:id", protect, downloadFile);

router.get("/preview/:id", protect, previewFile);

router.delete("/:id", protect, deleteFile);

router.get("/share/:id", protect, shareFile);

router.get("/search", protect, searchFiles);

router.patch("/:id", protect, renameFile);

router.patch("/move/:id", protect, moveFile);

router.post("/copy/:id", protect, copyFile);

router.get("/trash", protect, getTrashFiles);

router.patch("/restore/:id", protect, restoreFile);

router.delete("/permanent/:id", protect, permanentDeleteFile);

router.get("/activity", protect, getActivity);

export default router;