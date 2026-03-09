import File from "../models/File.js";
import User from "../models/User.js";
import { minioClient, BUCKET_NAME } from "../config/minio.js";
import { logActivity } from "../utils/activityLogger.js";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import crypto from "crypto";

/*
==============================
UPLOAD FILE
==============================
*/

export const uploadFile = async (req, res) => {
  try {
    const { folder } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const fileBuffer = file.buffer;

    // Generate hash for deduplication
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    // Check if file already exists (deduplication)
    const existingHashFile = await File.findOne({ hash });

    if (existingHashFile) {
      const newFile = await File.create({
        name: file.originalname,
        originalName: file.originalname,
        version: 1,
        isLatest: true,
        size: existingHashFile.size,
        mimeType: existingHashFile.mimeType,
        owner: req.user._id,
        folder: folder || null,
        storagePath: existingHashFile.storagePath,
        hash,
      });

      return res.json({
        message: "File already exists (deduplicated)",
        file: newFile,
      });
    }

    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    const objectName = `${Date.now()}-${sanitizedName}`;

    const user = await User.findById(req.user._id);

    // Storage quota check
    if (user.storageUsed + file.size > user.storageLimit) {
      return res.status(400).json({
        message: "Storage limit exceeded (10GB Free Plan)",
      });
    }

    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      fileBuffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );

    // Versioning check
    const existingVersionFile = await File.findOne({
      owner: req.user._id,
      originalName: file.originalname,
      folder: folder || null,
    }).sort({ version: -1 });

    let version = 1;

    if (existingVersionFile) {
      version = existingVersionFile.version + 1;

      existingVersionFile.isLatest = false;
      await existingVersionFile.save();
    }

    // Save file metadata
    const savedFile = await File.create({
      name: file.originalname,
      originalName: file.originalname,
      version,
      isLatest: true,
      size: file.size,
      mimeType: file.mimetype,
      owner: req.user._id,
      folder: folder || null,
      storagePath: objectName,
      hash,
    });

    // Activity Logging
    await logActivity(
      req.user._id,
      savedFile._id,
      "UPLOAD",
      `Uploaded file ${savedFile.name}`
    );

    // Increase storage usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: file.size },
    });

    res.status(201).json(savedFile);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
GET FILES (LIST)
==============================
*/
export const getFiles = async (req, res) => {
  try {
    const { folder } = req.query;

    const query = {
      owner: req.user._id,
      isTrashed: false,
    };

    if (folder) {
      query.folder = folder;
    }

    const files = await File.find(query).sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
DOWNLOAD FILE
==============================
*/
export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const objectName = file.storagePath;

    console.log("Downloading object:", objectName);

    const stream = await minioClient.getObject(BUCKET_NAME, objectName);

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

    stream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);

    if (error.code === "NoSuchKey") {
      return res.status(404).json({
        message: "File not found in storage",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

/*
==============================
FILE PREVIEW (Browser View)
==============================
*/
export const previewFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const stream = await minioClient.getObject(BUCKET_NAME, file.storagePath);

    res.setHeader("Content-Type", file.mimeType);

    stream.pipe(res);
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
MOVE FILE TO TRASH
==============================
*/
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.isTrashed) {
      return res.status(400).json({ message: "File already in trash" });
    }

    // ❌ DO NOT delete from MinIO
    // ❌ DO NOT reduce storageUsed

    file.isTrashed = true;
    file.trashedAt = new Date();

    await file.save();

    // Activity Logging
    await logActivity(
      req.user._id,
      file._id,
      "DELETE",
      `Moved ${file.name} to trash`,
    );

    res.json({
      message: "File moved to trash",
      file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
SHARE FILE (Generate Shareable Link)
==============================
*/
export const shareFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Generate presigned URL (valid for 1 hour)
    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      file.storagePath,
      60 * 60,
    );

    res.json({
      message: "Share link generated",
      url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
Search Files (Bonus)
==============================
*/
export const searchFiles = async (req, res) => {
  try {
    const { q } = req.query;

    const files = await File.find({
      owner: req.user._id,
      name: { $regex: q, $options: "i" },
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
Rename File (Bonus)
==============================
*/
export const renameFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const oldObjectName = file.storagePath;

    // preserve timestamp prefix
    const timestamp = oldObjectName.split("-")[0];

    const newObjectName = `${timestamp}-${name}`;

    // 1️⃣ Copy object
    await minioClient.copyObject(
      BUCKET_NAME,
      newObjectName,
      `/${BUCKET_NAME}/${oldObjectName}`,
    );

    // 2️⃣ Delete old object
    await minioClient.removeObject(BUCKET_NAME, oldObjectName);

    // 3️⃣ Update MongoDB
    file.name = name;
    file.storagePath = newObjectName;

    //Activity Logging
    await logActivity(
      req.user._id,
      file._id,
      "RENAME",
      `Renamed file to ${name}`,
    );

    await file.save();

    res.json({
      message: "File renamed successfully",
      file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
MOVE FILE TO FOLDER (Bonus)
==============================
*/
export const moveFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Update folder reference
    file.folder = folderId || null;

    await file.save();

    res.json({
      message: "File moved successfully",
      file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
COPY FILE
==============================
*/
export const copyFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find original file
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get user
    const user = await User.findById(req.user._id);

    // Check storage quota
    if (user.storageUsed + file.size > user.storageLimit) {
      return res.status(400).json({
        message: "Storage limit exceeded (10GB Free Plan)",
      });
    }

    // Generate new file name (Google Drive style)
    const baseName = file.name.replace(/(\(\d+\))?(\.[^.]+)$/, "");
    const extension = file.name.split(".").pop();

    const existingFiles = await File.find({
      owner: req.user._id,
      name: new RegExp(`^${baseName}`),
    });

    let copyIndex = 1;

    const existingNames = existingFiles.map((f) => f.name);

    while (existingNames.includes(`${baseName} (${copyIndex}).${extension}`)) {
      copyIndex++;
    }

    const newName = `${baseName} (${copyIndex}).${extension}`;

    // Generate new MinIO object name
    const newObjectName = `${Date.now()}-${newName}`;

    console.log("Source object:", file.storagePath);
    console.log("New object:", newObjectName);

    // Ensure source object exists in MinIO
    await minioClient.statObject(BUCKET_NAME, file.storagePath);

    // Copy object in MinIO
    await minioClient.copyObject(
      BUCKET_NAME,
      newObjectName,
      `/${BUCKET_NAME}/${file.storagePath}`,
    );

    // Save metadata in MongoDB
    const newFile = await File.create({
      name: newName,
      size: file.size,
      mimeType: file.mimeType,
      owner: req.user._id,
      folder: file.folder,
      storagePath: newObjectName,
    });

    // Increase storage usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: file.size },
    });

    res.json({
      message: "File copied successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Copy file error:", error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
RESTORE FILE
==============================
*/
export const restoreFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isTrashed = false;
    file.trashedAt = null;

    await file.save();

    res.json({
      message: "File restored successfully",
      file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
PERMANENT DELETE FILE
==============================
*/
export const permanentlyDeleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.isTrashed) {
      return res.status(400).json({
        message: "File must be in trash before permanent delete",
      });
    }

    // Check how many files reference the same storage object
    const referenceCount = await File.countDocuments({
      storagePath: file.storagePath,
    });

    // Delete from MinIO ONLY if this is the last reference
    if (referenceCount === 1) {
      await minioClient.removeObject(BUCKET_NAME, file.storagePath);
    }

    // Reduce storage usage for the user
    await User.findByIdAndUpdate(file.owner, {
      $inc: { storageUsed: -file.size },
    });

    // Remove file metadata
    await File.findByIdAndDelete(id);

    // Activity Logging
    await logActivity(
      req.user._id,
      file._id,
      "PERMANENT_DELETE",
      `Permanently deleted ${file.name}`
    );

    res.json({
      message: "File permanently deleted",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
GET TRASH FILES
==============================
*/
export const getTrashFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user._id,
      isTrashed: true,
    }).sort({ trashedAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
GET FILE ACTIVITY LOG
==============================
*/
export const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("file", "name");

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
GET FILE VERSIONS
==============================
*/
export const getFileVersions = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    const versions = await File.find({
      owner: req.user._id,
      originalName: file.originalName,
      folder: file.folder,
    }).sort({ version: -1 });

    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
ENABLE PUBLIC SHARE
==============================
*/
export const enablePublicShare = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.isPublic) {
      file.isPublic = true;
      file.publicId = nanoid(10);
      await file.save();
    }

    const publicUrl = `${req.protocol}://${req.get("host")}/public/${file.publicId}`;

    res.json({
      message: "Public link generated",
      publicUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
DISABLE PUBLIC SHARE
==============================
*/
export const disablePublicShare = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isPublic = false;
    file.publicId = null;

    await file.save();

    res.json({ message: "Public sharing disabled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
PUBLIC FILE ACCESS
==============================
*/
export const getPublicFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({ publicId: id, isPublic: true });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const stream = await minioClient.getObject(BUCKET_NAME, file.storagePath);

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);

    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
GENERATE DOWNLOAD URL
==============================
*/

export const getDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const expiry = 60 * 5; // 5 minutes

    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      file.storagePath,
      expiry,
    );

    res.json({
      downloadUrl: url,
      expiresIn: "5 minutes",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

/*
==============================
GENERATE PREVIEW URL
==============================
*/

export const getPreviewUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const expiry = 60 * 5; // 5 minutes

    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      file.storagePath,
      expiry,
    );

    res.json({
      previewUrl: url,
      mimeType: file.mimeType,
      expiresIn: "5 minutes",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

/*
==============================
UPLOAD FILE CHUNK
==============================
*/
export const uploadChunk = async (req, res) => {
  try {
    const { uploadId, chunkNumber } = req.body;

    const chunkDir = path.join("uploads/chunks", uploadId);

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    const chunkPath = path.join(chunkDir, `chunk_${chunkNumber}`);

    fs.writeFileSync(chunkPath, req.file.buffer);

    res.json({
      message: "Chunk uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
MERGE CHUNKS
==============================
*/
export const completeChunkUpload = async (req, res) => {
  try {
    const { uploadId, fileName } = req.body;

    const chunkDir = path.join("uploads/chunks", uploadId);

    const chunks = fs.readdirSync(chunkDir);

    const finalFilePath = path.join("uploads", fileName);

    const writeStream = fs.createWriteStream(finalFilePath);

    for (const chunk of chunks.sort()) {
      const chunkPath = path.join(chunkDir, chunk);

      const data = fs.readFileSync(chunkPath);

      writeStream.write(data);
    }

    writeStream.end();

    // Upload to MinIO
    const objectName = Date.now() + "-" + fileName;

    await minioClient.fPutObject(BUCKET_NAME, objectName, finalFilePath);

    // Cleanup chunks
    fs.rmSync(chunkDir, { recursive: true });

    res.json({
      message: "File uploaded successfully",
      objectName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
