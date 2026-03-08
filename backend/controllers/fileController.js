import File from "../models/File.js";
import User from "../models/User.js";
import minioClient from "../config/minio.js";
import { BUCKET_NAME } from "../config/storage.js";
import { logActivity } from "../utils/activityLogger.js";

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

    const sanitizedName = file.originalname.replace(/\s+/g, "_");

    const objectName = `${Date.now()}-${sanitizedName}`;

    const user = await User.findById(req.user._id);

    // ✅ Storage quota check
    if (user.storageUsed + file.size > user.storageLimit) {
      return res.status(400).json({
        message: "Storage limit exceeded (10GB Free Plan)",
      });
    }

    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      },
    );

    // Save metadata
    const savedFile = await File.create({
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      owner: req.user._id,
      folder: folder || null,
      storagePath: objectName,
    });

    //Activity Logging
    await logActivity(
      req.user._id,
      savedFile._id,
      "UPLOAD",
      `Uploaded file ${savedFile.name}`,
    );

    // ✅ Increase storage usage
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
DELETE FILE
==============================
*/
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file from MinIO
    await minioClient.removeObject(BUCKET_NAME, file.storagePath);

    // Soft delete in MongoDB
    file.isTrashed = true;
    file.trashedAt = new Date();

    await file.save();

    // ✅ Reduce storage usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -file.size },
    });

    //Activity Logging
    await logActivity(
      req.user._id,
      file._id,
      "DELETE",
      `Moved ${file.name} to trash`,
    );

    res.json({ message: "File moved to trash" });
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
COPY FILE (Bonus)
==============================
*/
export const copyFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findById(req.user._id);

    if (user.storageUsed + file.size > user.storageLimit) {
      return res.status(400).json({
        message: "Storage limit exceeded (10GB Free Plan)",
      });
    }

    const baseName = file.name.replace(/(\(\d+\))?(\.[^.]+)$/, "");
    const extension = file.name.split(".").pop();

    // find existing copies
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

    const newObjectName = Date.now() + "-" + newName;

    // Copy object inside MinIO
    await minioClient.copyObject(
      BUCKET_NAME,
      newObjectName,
      `/${BUCKET_NAME}/${file.storagePath}`,
    );

    const newFile = await File.create({
      name: newName,
      size: file.size,
      mimeType: file.mimeType,
      owner: req.user._id,
      folder: file.folder,
      storagePath: newObjectName,
    });

    // ✅ Increase storage usage
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: file.size },
    });

    res.json({
      message: "File copied successfully",
      file: newFile,
    });
  } catch (error) {
    console.error(error);
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
export const permanentDeleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Only allow permanent delete if file is in trash
    if (!file.isTrashed) {
      return res.status(400).json({
        message: "File must be in trash before permanent delete",
      });
    }

    // Delete from MinIO
    await minioClient.removeObject(BUCKET_NAME, file.storagePath);

    // Delete from MongoDB
    await File.findByIdAndDelete(id);

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
export const getActivity = async (req,res) => {

  try {

    const activities = await Activity.find({
      user: req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("file","name");

    res.json(activities);

  } catch(error){

    res.status(500).json({error:error.message});

  }

};