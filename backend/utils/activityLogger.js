import Activity from "../models/Activity.js";

export const logActivity = async (userId, fileId, action, details="") => {

  try {

    await Activity.create({
      user: userId,
      file: fileId,
      action,
      details
    });

  } catch (error) {

    console.error("Activity log failed:", error);

  }

};