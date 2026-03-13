import Folder from "../models/Folder.js";
import File from "../models/File.js";

/*
==============================
GET ROOT DRIVE
==============================
*/

export const getRootDrive = async (req, res) => {
  try {

    const folders = await Folder.find({
      owner: req.user._id,
      parentFolder: null
    }).sort({ createdAt: -1 });

    const files = await File.find({
      owner: req.user._id,
      folder: null,
      isTrashed: false
    }).sort({ createdAt: -1 });

    res.json({
      folders,
      files
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
==============================
GET FOLDER CONTENT
==============================
*/

export const getFolderContent = async (req, res) => {
  try {

    const { folderId } = req.params;

    const folders = await Folder.find({
      owner: req.user._id,
      parentFolder: folderId
    }).sort({ createdAt: -1 });

    const files = await File.find({
      owner: req.user._id,
      folder: folderId,
      isTrashed: false
    }).sort({ createdAt: -1 });

    res.json({
      folders,
      files
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};