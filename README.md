# ☁️ DriveX
Cloud Storage Platform

DriveX is a **modern cloud-based file storage system** that allows users to securely upload, organize, manage, and retrieve files.

The platform is inspired by systems such as **Google Drive, Dropbox, and OneDrive**, and is designed with scalable backend architecture using **Node.js, MongoDB, and MinIO Object Storage**.

DriveX focuses on providing a modular architecture that supports **secure authentication, efficient storage management, and scalable API design**.

---

# 👤 Author

Aditya Dixit

GitHub

```text
https://github.com/Aditya-dxt
```

---

# 🌐 Live Backend

Backend API

```text
https://drivex-backend-qrfb.onrender.com
```

Swagger API Documentation

```text
https://drivex-backend-qrfb.onrender.com/docs
```

---

# 🧠 Complete System Architecture

```text
                     ┌────────────────────────────┐
                     │        Client Apps         │
                     │   Web / Mobile / Desktop   │
                     └─────────────┬──────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │      DriveX API     │
                        │    Node.js Backend  │
                        └───────────┬─────────┘
                                    │
         ┌──────────────────────────┼─────────────────────────┐
         ▼                          ▼                         ▼
 ┌──────────────┐          ┌────────────────┐         ┌────────────────┐
 │Authentication│          │ File Management│         │ Folder Manager │
 │ JWT Security │          │ Upload / Delete│         │ Organize Files │
 └──────┬───────┘          └───────┬────────┘         └───────┬────────┘
        │                          │                          │
        ▼                          ▼                          ▼
                ┌────────────────────────────────┐
                │          Service Layer         │
                │ Business Logic & Storage Logic │
                └───────────────┬────────────────┘
                                │
                 ┌──────────────┴───────────────┐
                 ▼                              ▼
          ┌───────────────┐             ┌────────────────┐
          │    MongoDB    │             │      MinIO     │
          │ Metadata Store│             │ Object Storage │
          └───────────────┘             └────────────────┘
```

---

# ⚙️ Technology Stack

Backend

```text
Node.js
Express.js
```

Database

```text
MongoDB (Mongoose ODM)
```

Object Storage

```text
MinIO (S3 Compatible Storage)
```

Authentication

```text
JWT Authentication
```

API Documentation

```text
Swagger (OpenAPI)
```

Deployment

```text
Render
```

---

# 📁 Repository Structure

```text
drivex
│
├── backend
│   │
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── uploads
│
├── frontend (coming soon)
│
└── README.md
```

---

# 📦 Core Platform Features

Authentication System

```text
• User Registration
• User Login
• JWT Authentication
• Secure API Access
```

File Management

```text
• Upload Files
• Download Files
• Delete Files
• Rename Files
• File Preview
```

Folder Management

```text
• Create Folders
• Nested Folder Structure
• Organize Files
```

Storage Analytics

```text
• Storage Usage Tracking
• File Count
• Folder Count
```

Activity Tracking

```text
• Upload History
• Delete History
• Folder Activity
```

---

# 🔄 File Storage Pipeline

```text
User Upload File
        │
        ▼
Frontend Application
        │
        ▼
DriveX Backend API
        │
        ▼
Multer Upload Middleware
        │
        ▼
MinIO Object Storage
        │
        ▼
MongoDB Metadata Storage
```

---

# 🔐 Authentication Flow

```text
User Login
     │
     ▼
Auth Controller
     │
     ▼
Verify Credentials
     │
     ▼
Generate JWT Token
     │
     ▼
Protected API Access
```

---

# 📊 Storage Analytics Pipeline

```text
User Files
     │
     ▼
MongoDB Metadata
     │
     ▼
Storage Controller
     │
     ▼
Dashboard API
     │
     ▼
Frontend Analytics
```

---

# 📡 API Architecture

```text
Client Request
      │
      ▼
Express Route
      │
      ▼
Authentication Middleware
      │
      ▼
Controller
      │
      ▼
Service Layer
      │
      ▼
Database / Storage
      │
      ▼
API Response
```

---

# 📦 Example API Endpoints

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

# 📱 Future Roadmap

DriveX will continue evolving with additional features.

```text
• React Frontend Dashboard
• Android Mobile Application
• File Sharing Links
• Chunk Upload for Large Files
• AI File Organization
• File Encryption
• Multi-device Sync
```

---

# 🚀 Recommended Improvements

Based on the current architecture, the following improvements can enhance the platform.

```text
• Add Redis caching for performance
• Add background job processing
• Add role-based access control
• Integrate monitoring tools
```

---

# ⭐ Support

If you found this project helpful, consider giving it a **star on GitHub**.
