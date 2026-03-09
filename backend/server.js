import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

app.use(helmet());

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DriveX API is running 🚀",
    status: "healthy",
  });
});

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime()
  });
});

app.get("/api", (req, res) => {
  res.json({
    routes: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/files",
      "/api/folders",
      "/api/storage",
      "/api/dashboard",
    ],
  });
});

app.use("/api", limiter);

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

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});