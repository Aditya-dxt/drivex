import File from "../models/File.js";

export const getStorageStats = async (req, res) => {
  try {

    const files = await File.find({
      owner: req.user._id,
      isTrashed: false
    });

    const totalUsed = files.reduce((sum, file) => sum + file.size, 0);

    const storageLimit = req.user.storageLimit;

    const remaining = storageLimit - totalUsed;

    res.json({
      storageUsed: totalUsed,
      storageLimit,
      remaining
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};