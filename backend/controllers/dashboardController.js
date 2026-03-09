import File from "../models/File.js";
import Folder from "../models/Folder.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalFiles = await File.countDocuments({
      owner: userId,
      isTrashed: false
    });

    const totalFolders = await Folder.countDocuments({
      owner: userId
    });

    const user = await User.findById(userId);

    const recentActivity = await Activity.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalFiles,
      totalFolders,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      recentActivity
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};