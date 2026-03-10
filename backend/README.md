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
```text
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
```
 
---

# 📁 Backend Folder Structure

```text
backend
│
├── config
│ ├── db.js
│ ├── minio.js
│ ├── multer.js
│ └── swagger.js
│
├── controllers
│ ├── authController.js
│ ├── dashboardController.js
│ ├── fileController.js
│ ├── folderController.js
│ └── storageController.js
│
├── middleware
│ └── authMiddleware.js
│
├── models
│ ├── User.js
│ ├── File.js
│ ├── Folder.js
│ └── Activity.js
│
├── routes
│ ├── authRoutes.js
│ ├── dashboardRoutes.js
│ ├── fileRoutes.js
│ ├── folderRoutes.js
│ └── storageRoutes.js
│
├── services
│
├── utils
│ └── activityLogger.js
│
├── uploads
│
└── .env
```

---


---

# 📄 File-by-File Breakdown

### db.js

Purpose
Handles MongoDB database connection.

Responsibilities
• Connect backend to MongoDB
• Manage database configuration
• Ensure database availability

---

### minio.js

Purpose
Purpose


Configures MinIO object storage.


Responsibilities

```text
• Store uploaded files
• Retrieve file objects
• Manage storage bucket
```

---

### multer.js

Purpose


Handles file upload processing.


Responsibilities

```text
• Process multipart file uploads
• Validate uploaded files
• Pass files to storage service
```

---

### authController.js

Purpose


Handles user authentication.


Responsibilities

```text
• User registration
• User login
• JWT token generation
```

---

### fileController.js

Purpose


Manages file operations.


Responsibilities

```text
• Upload files
• Download files
• Delete files
• Rename files
• Share files
```

---

### folderController.js

Purpose


Handles folder management.


Responsibilities

```text
• Create folders
• Rename folders
• Delete folders
• Manage nested folders
```

---

### storageController.js

Purpose


Provides storage analytics.


Responsibilities

```text
• Track user storage usage
• Provide dashboard statistics
```

---

### activityLogger.js

Purpose


Tracks user activity within the system.


Responsibilities

```text
• Log uploads
• Log deletions
• Log folder operations
```

---

# 🔄 File Upload Flow

```text
User Upload File
│
▼
Multer Middleware
│
▼
FileController
│
▼
MinIO Storage
│
▼
MongoDB Metadata
```

---

# 📦 API Endpoints

## Authentication


POST /api/auth/register
POST /api/auth/login


## Files


POST /api/files/upload
GET /api/files
GET /api/files/:id
DELETE /api/files/:id


## Folders


POST /api/folders
GET /api/folders
DELETE /api/folders/:id


## Storage


GET /api/storage


---

# ⚙️ Environment Variables

Create `.env` file


PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

MINIO_ENDPOINT=your_minio_endpoint
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=drivex


---

# ▶️ Run Backend Locally

Clone repository


git clone https://github.com/Aditya-dxt/drivex


Navigate to backend


cd backend


Install dependencies


npm install


Start development server


npm run dev


Server runs at


http://localhost:5000


---

# 🔮 Future Improvements

```text
• Large File Chunk Upload
• File Encryption
• Signed Download URLs
• AI File Categorization
• Mobile App Integration
```

---

# 👨‍💻 Author

Aditya Dixit

GitHub


https://github.com/Aditya-dxt


---

# ⭐ Support

If you like this project, consider giving it a **GitHub star**.
