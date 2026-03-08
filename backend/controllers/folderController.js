import Folder from "../models/Folder.js";

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

    const folders = await Folder.find({
      owner: req.user._id
    });

    res.json(folders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};