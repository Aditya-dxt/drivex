# ☁️ DriveX Backend
**Cloud Storage Backend API**

This module implements the **backend infrastructure for DriveX**, a cloud-based storage platform similar to **Google Drive / Dropbox**.

The backend handles **authentication, file storage, folder management, storage analytics, and activity tracking**.

It is designed using **Node.js, Express.js, MongoDB, and MinIO Object Storage** to provide scalable and efficient file management.

---

## 👤 Ownership

Owner: Aditya Dixit  
Role: Backend Engineer – Cloud Storage & API Development

Responsibilities of this module include:

- Building scalable backend APIs
- Managing user authentication
- Handling file uploads and storage
- Organizing files and folders
- Tracking storage usage
- Maintaining activity logs

---

# 🌐 Live Backend

Base API
https://drivex-backend-qrfb.onrender.com

Swagger Documentation
https://drivex-backend-qrfb.onrender.com/docs


---

# 🧠 Backend System Architecture

             [ Web / Mobile Clients ]
                       │
                       ▼
             ┌─────────────────────┐
             │   Express Backend   │
             │    Node.js Server   │
             └──────────┬──────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
  [ API Routes ]   [ Middleware ]   [ Swagger Docs ]
        │               │
        ▼               ▼
    ┌─────────────────────────┐
    │       Controllers       │
    │    Business Logic Layer │
    └──────────────┬──────────┘
                   │
                   ▼
             [ Services Layer ]
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
  [ MongoDB ]            [ MinIO Storage ]
 File Metadata             Object Storage

 
---

# 📁 Backend Folder Structure
