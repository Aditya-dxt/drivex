import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    size: Number,

    mimeType: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    storagePath: String,

    isTrashed: {
      type: Boolean,
      default: false,
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    version: {
      type: Number,
      default: 1,
    },

    originalName: {
      type: String,
    },

    isLatest: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("File", fileSchema);
