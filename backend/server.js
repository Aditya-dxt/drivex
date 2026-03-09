import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import { getPublicFile } from "./controllers/fileController.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/public/:id", getPublicFile);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DriveX server running on port ${PORT}`);
});