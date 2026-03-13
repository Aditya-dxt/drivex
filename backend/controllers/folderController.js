import Folder from "../models/Folder.js";
import File from "../models/File.js";

export const createFolder = async (req, res) => {
  try {

    const { name, parentFolder } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user._id,
      parentFolder: parentFolder || null
    });

    res.status(201).json(folder);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getFolders = async (req, res) => {
  try {
    const { parentFolder } = req.query;

    const query = {
      owner: req.user._id,
    };

    if (parentFolder) {
      query.parentFolder = parentFolder;
    } else {
      query.parentFolder = null;
    }

    const folders = await Folder.find(query).sort({ createdAt: -1 });

    res.json(folders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
==============================
RECURSIVE FOLDER SIZE
==============================
*/
export const getFolderSize = async (req, res) => {
  try {
    const { folderId } = req.params;

    async function calculateSize(folderId) {
      let totalSize = 0;

      // Files in this folder
      const files = await File.find({
        folder: folderId,
        isTrashed: false
      });

      for (const file of files) {
        totalSize += file.size;
      }

      // Subfolders
      const subfolders = await Folder.find({
        parentFolder: folderId
      });

      for (const sub of subfolders) {
        totalSize += await calculateSize(sub._id);
      }

      return totalSize;
    }

    const folderSize = await calculateSize(folderId);

    res.json({
      folderSize
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};