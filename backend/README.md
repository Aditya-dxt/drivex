# ☁️ DriveX Backend API
Cloud Storage Backend for **DriveX**

DriveX Backend is a scalable API service that powers the DriveX cloud storage platform.  
It allows users to **securely upload, manage, organize, and retrieve files** similar to modern cloud storage platforms like Google Drive or Dropbox.

The backend is built using **Node.js, Express.js, MongoDB, and MinIO Object Storage** and follows a modular architecture designed for scalability and maintainability.

---

# 👤 Author

Aditya Dixit

GitHub

```text
https://github.com/Aditya-dxt
```

---

# 🌐 Live Backend

Base API

```text
https://drivex-backend-qrfb.onrender.com
```

Swagger Documentation

```text
https://drivex-backend-qrfb.onrender.com/docs
```

---

# 🧠 Backend System Architecture

```text
                ┌──────────────────────────────┐
                │        Client Apps           │
                │   Web / Mobile / API Client  │
                └───────────────┬──────────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │  Express Server│
                        │   Node.js API  │
                        └───────┬────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
     ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
     │   Routes    │    │  Middleware  │    │   Swagger   │
     │API Endpoints│    │ JWT Security │    │ API Docs    │
     └──────┬──────┘    └──────┬───────┘    └─────────────┘
            │                  │
            ▼                  ▼
      ┌─────────────────────────────┐
      │         Controllers         │
      │     Business Logic Layer    │
      └──────────────┬──────────────┘
                     │
                     ▼
               ┌─────────────┐
               │  Services   │
               │Storage Logic│
               └──────┬──────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   ┌───────────────┐       ┌───────────────┐
   │    MongoDB    │       │     MinIO     │
   │ Metadata Stor │       │ Object Storage│
   └───────────────┘       └───────────────┘
```

---

# 🧩 Backend Responsibilities

The DriveX backend manages all server-side operations.

Core responsibilities include:

```text
• User Authentication
• File Upload and Storage
• File Metadata Management
• Folder Organization
• Storage Analytics
• Activity Tracking
• API Documentation
```

---

# 📁 Backend Directory Structure

```text
backend
│
├── config
│   ├── db.js
│   ├── minio.js
│   ├── multer.js
│   └── swagger.js
│
├── controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── fileController.js
│   ├── folderController.js
│   └── storageController.js
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   ├── User.js
│   ├── File.js
│   ├── Folder.js
│   └── Activity.js
│
├── routes
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── fileRoutes.js
│   ├── folderRoutes.js
│   └── storageRoutes.js
│
├── services
│
├── utils
│   └── activityLogger.js
│
├── uploads
│
└── .env
```

---

# 📄 File-by-File Breakdown

## config/db.js

Purpose

```text
Establishes MongoDB database connection.
```

Responsibilities

```text
• Initialize MongoDB connection
• Handle database configuration
• Ensure database availability
```

---

## config/minio.js

Purpose

```text
Configures MinIO object storage service.
```

Responsibilities

```text
• Connect backend to MinIO
• Manage storage buckets
• Upload and retrieve file objects
```

---

## config/multer.js

Purpose

```text
Handles file upload parsing and validation.
```

Responsibilities

```text
• Process multipart file uploads
• Validate file formats
• Pass files to storage service
```

---

## controllers/authController.js

Purpose

```text
Handles user authentication logic.
```

Responsibilities

```text
• User registration
• User login
• JWT token generation
```

---

## controllers/fileController.js

Purpose

```text
Manages file operations.
```

Responsibilities

```text
• Upload files
• Download files
• Rename files
• Delete files
• Share files
```

---

## controllers/folderController.js

Purpose

```text
Handles folder management.
```

Responsibilities

```text
• Create folders
• Rename folders
• Delete folders
• Manage nested folders
```

---

## controllers/storageController.js

Purpose

```text
Provides storage analytics.
```

Responsibilities

```text
• Calculate storage usage
• Provide dashboard statistics
```

---

## utils/activityLogger.js

Purpose

```text
Tracks user activity across the system.
```

Responsibilities

```text
• Log file uploads
• Log deletions
• Log folder operations
```

---

# 🔄 File Upload Workflow

```text
User Uploads File
        │
        ▼
Multer Middleware
        │
        ▼
File Controller
        │
        ▼
MinIO Object Storage
        │
        ▼
MongoDB Metadata Storage
```

---

# 📦 API Endpoints

Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

Files

```text
POST /api/files/upload
GET /api/files
GET /api/files/:id
DELETE /api/files/:id
```

Folders

```text
POST /api/folders
GET /api/folders
DELETE /api/folders/:id
```

Storage

```text
GET /api/storage
```

---

# 📊 Storage Analytics Flow

```text
User Files
     │
     ▼
MongoDB File Metadata
     │
     ▼
Storage Controller
     │
     ▼
Dashboard API Response
```

---

# ⚙️ Environment Variables

Create `.env` file

```text
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

MINIO_ENDPOINT=your_minio_endpoint
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=drivex
```

---

# ▶️ Running the Backend Locally

Clone repository

```text
git clone https://github.com/Aditya-dxt/drivex
```

Navigate to backend directory

```text
cd backend
```

Install dependencies

```text
npm install
```

Start development server

```text
npm run dev
```

Server runs at

```text
http://localhost:5000
```

---

# 🔮 Recommended Improvements

Based on the current architecture, the following improvements can further enhance the backend.

```text
• Add Redis caching for faster file metadata access
• Add background jobs for file processing
• Implement role-based access control (RBAC)
• Add monitoring with Prometheus or Grafana
```

---

# 📈 Future Roadmap

```text
• React Frontend Dashboard
• Mobile App (Android)
• Public File Sharing Links
• AI-based File Categorization
• Real-time storage analytics
```

---

# ⭐ Support

If you found this project useful, consider giving it a **GitHub star**.
