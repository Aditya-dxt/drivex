import express from "express";
import { upload } from "../config/multer.js";
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
  permanentlyDeleteFile,
  getActivity,
  getFileVersions,
  enablePublicShare,
  disablePublicShare,
  getPublicFile,
  getDownloadUrl,
  getPreviewUrl,
  uploadChunk,
  completeChunkUpload,
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

router.delete("/permanent/:id", protect, permanentlyDeleteFile);

router.get("/activity", protect, getActivity);

router.get("/versions/:id", protect, getFileVersions);

router.post("/public/:id", protect, enablePublicShare);

router.delete("/public/:id", protect, disablePublicShare);

router.get("/public/:token", getPublicFile);

router.get("/download-url/:id", protect, getDownloadUrl);

router.get("/preview-url/:id", protect, getPreviewUrl);

router.post("/upload-chunk", protect, upload.single("chunk"), uploadChunk);

router.post("/upload-complete", protect, completeChunkUpload);

export default router;