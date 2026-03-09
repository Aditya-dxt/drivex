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

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management APIs
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 */
router.post("/upload", protect, upload.single("file"), uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files
 *     tags: [Files]
 */
router.get("/", protect, getFiles);

/**
 * @swagger
 * /api/files/download/{id}:
 *   get:
 *     summary: Download file
 *     tags: [Files]
 */
router.get("/download/:id", protect, downloadFile);

/**
 * @swagger
 * /api/files/preview/{id}:
 *   get:
 *     summary: Preview file
 *     tags: [Files]
 */
router.get("/preview/:id", protect, previewFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Move file to trash
 *     tags: [Files]
 */
router.delete("/:id", protect, deleteFile);

/**
 * @swagger
 * /api/files/share/{id}:
 *   get:
 *     summary: Share file
 *     tags: [Files]
 */
router.get("/share/:id", protect, shareFile);

/**
 * @swagger
 * /api/files/search:
 *   get:
 *     summary: Search files
 *     tags: [Files]
 */
router.get("/search", protect, searchFiles);

/**
 * @swagger
 * /api/files/{id}:
 *   patch:
 *     summary: Rename file
 *     tags: [Files]
 */
router.patch("/:id", protect, renameFile);

/**
 * @swagger
 * /api/files/move/{id}:
 *   patch:
 *     summary: Move file
 *     tags: [Files]
 */
router.patch("/move/:id", protect, moveFile);

/**
 * @swagger
 * /api/files/copy/{id}:
 *   post:
 *     summary: Copy file
 *     tags: [Files]
 */
router.post("/copy/:id", protect, copyFile);

/**
 * @swagger
 * /api/files/trash:
 *   get:
 *     summary: Get trash files
 *     tags: [Files]
 */
router.get("/trash", protect, getTrashFiles);

/**
 * @swagger
 * /api/files/restore/{id}:
 *   patch:
 *     summary: Restore file
 *     tags: [Files]
 */
router.patch("/restore/:id", protect, restoreFile);

/**
 * @swagger
 * /api/files/permanent/{id}:
 *   delete:
 *     summary: Permanently delete file
 *     tags: [Files]
 */
router.delete("/permanent/:id", protect, permanentlyDeleteFile);

/**
 * @swagger
 * /api/files/activity:
 *   get:
 *     summary: Get file activity
 *     tags: [Files]
 */
router.get("/activity", protect, getActivity);

/**
 * @swagger
 * /api/files/versions/{id}:
 *   get:
 *     summary: Get file versions
 *     tags: [Files]
 */
router.get("/versions/:id", protect, getFileVersions);

/**
 * @swagger
 * /api/files/public/{id}:
 *   post:
 *     summary: Enable public sharing
 *     tags: [Files]
 */
router.post("/public/:id", protect, enablePublicShare);

/**
 * @swagger
 * /api/files/public/{id}:
 *   delete:
 *     summary: Disable public sharing
 *     tags: [Files]
 */
router.delete("/public/:id", protect, disablePublicShare);

/**
 * @swagger
 * /api/files/public/{token}:
 *   get:
 *     summary: Access public file
 *     tags: [Files]
 */
router.get("/public/:token", getPublicFile);

/**
 * @swagger
 * /api/files/download-url/{id}:
 *   get:
 *     summary: Generate download URL
 *     tags: [Files]
 */
router.get("/download-url/:id", protect, getDownloadUrl);

/**
 * @swagger
 * /api/files/preview-url/{id}:
 *   get:
 *     summary: Generate preview URL
 *     tags: [Files]
 */
router.get("/preview-url/:id", protect, getPreviewUrl);

/**
 * @swagger
 * /api/files/upload-chunk:
 *   post:
 *     summary: Upload file chunk
 *     tags: [Files]
 */
router.post("/upload-chunk", protect, upload.single("chunk"), uploadChunk);

/**
 * @swagger
 * /api/files/upload-complete:
 *   post:
 *     summary: Complete chunk upload
 *     tags: [Files]
 */
router.post("/upload-complete", protect, completeChunkUpload);

export default router;