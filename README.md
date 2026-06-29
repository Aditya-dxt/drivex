<div align="center">

# ☁️ DriveX — Cloud Storage Platform

**A modern, scalable cloud file storage system**  
inspired by Google Drive and Dropbox, built with Node.js · MongoDB · MinIO

[![Backend API](https://img.shields.io/badge/🔗%20Backend%20API-Live-brightgreen?style=for-the-badge)](https://drivex-backend-qrfb.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/📘%20Swagger%20Docs-Live-orange?style=for-the-badge)](https://drivex-backend-qrfb.onrender.com/docs)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=for-the-badge&logo=minio&logoColor=white)](https://min.io/)
[![License](https://img.shields.io/github/license/Aditya-dxt/drivex?style=for-the-badge)](LICENSE)

</div>

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🔗 Backend REST API | https://drivex-backend-qrfb.onrender.com |
| 📘 Swagger API Docs | https://drivex-backend-qrfb.onrender.com/docs |

> **Note:** First load may take ~30 seconds (Render free tier cold start).

---

## 🧩 What Is DriveX?

DriveX is a **production-grade cloud file storage backend** that lets users securely upload, organize, manage, and retrieve files — with a clean REST API, JWT authentication, MinIO object storage, and a nested folder system.

---

## 🏗️ System Architecture

```
              +----------------------------+
              |         Client Apps        |
              |   Web / Mobile / Desktop   |
              +-------------+--------------+
                            |
                            v
                 +---------------------+
                 |     DriveX API      |
                 |   Node.js Backend   |
                 +----------+----------+
                            |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
+---------------+   +-----------------+   +----------------+
|     Auth      |   | File Management |   | Folder Manager |
| JWT Security  |   | Upload / Delete |   | Nested Folders |
+-------+-------+   +--------+--------+   +-------+--------+
        |                    |                    |
        +--------------------+--------------------+
                             |
                             v
               +---------------------------+
               |        Service Layer      |
               |  Business & Storage Logic |
               +-------------+-------------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
      +---------------+           +------------------+
      |    MongoDB    |           |      MinIO       |
      |   Metadata    |           |  Object Storage  |
      +---------------+           +------------------+
```
---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected API routes via middleware

### 📁 File Management
- Upload, download, delete & rename files
- File preview support
- Multer middleware for multipart upload handling
- Files stored in **MinIO** (S3-compatible object storage)
- Metadata stored in **MongoDB**

### 🗂️ Folder Management
- Create and delete folders
- Nested folder structure support
- Organize files across folder hierarchy

### 📊 Storage Analytics
- Real-time storage usage tracking
- File & folder count per user
- Upload and delete activity history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Object Storage** | MinIO (S3-compatible) |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Upload** | Multer middleware |
| **API Docs** | Swagger / OpenAPI |
| **Deployment** | Render |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + receive JWT |

### Files
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/files/upload` | Upload a file |
| GET | `/api/files` | List all user files |
| GET | `/api/files/:id` | Get file by ID |
| DELETE | `/api/files/:id` | Delete a file |

### Folders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/folders` | Create a folder |
| GET | `/api/folders` | List all folders |
| DELETE | `/api/folders/:id` | Delete a folder |

### Storage
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/storage` | Get usage analytics |

📘 Full interactive docs: [Swagger UI →](https://drivex-backend-qrfb.onrender.com/docs)

---

## 🔄 File Upload Pipeline
```
                    User Selects File

                             │

                             ▼

                      Express Route

                             │

                             ▼

                Auth Middleware (JWT check)

                             │

                             ▼

                   Multer Upload Handler

                             │

                             ▼

     MinIO Object Storage  ←── stores the actual file

                             │

                             ▼

MongoDB Metadata      ←── stores filename, size, owner, path

                             │

                             ▼

                       API Response
```

---

## 📂 Project Structure
```
drivex/

├── backend/

│   ├── config/         # DB & MinIO connection

│   ├── controllers/    # Route handlers

│   ├── middleware/     # Auth guard, error handler

│   ├── models/         # Mongoose schemas

│   ├── routes/         # API route definitions

│   ├── services/       # Business logic

│   ├── utils/          # Helper functions

│   └── uploads/        # Temp upload directory

├── frontend-web/       # Frontend (in progress)

└── README.md

```
---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Aditya-dxt/drivex.git
cd drivex/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY

# Run
npm run dev        # → http://localhost:5000
```

---

## 🔮 Roadmap

- [ ] React frontend dashboard
- [ ] File sharing via public/private links
- [ ] Chunked upload for large files (>100MB)
- [ ] AI-powered file organisation & tagging
- [ ] File encryption at rest
- [ ] Multi-device sync
- [ ] Redis caching for metadata
- [ ] Role-based access control (admin / viewer / editor)
- [ ] Android mobile app

---

## 📄 License

MIT — open source and free to use.

---

<div align="center">
  Built by <a href="https://github.com/Aditya-dxt">Aditya Dixit</a>
</div>
