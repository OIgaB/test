# Backend for files (.pdf, images, ...) management

A backend service designed for file handling, integrating cloud storage with a metadata database. This system allows users to upload files and documents while maintaining high performance by offloading binary data to the cloud.

---

## 🚀 Features

* **Cloud-First Storage**: Offloads heavy file data to Supabase Storage to keep MongoDB lightweight.
* **Hybrid Workflow**: Combines SQL-like storage management with NoSQL metadata flexibility.
* **Security & Privacy**: Support for Private Buckets using **Signed URLs** (time-limited access).
* **Performance Monitoring**: Optimized for low-latency operations, verifiable via Flamegraph profiling.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Node.js (ES Modules) & Express |
| **Cloud Storage** | Supabase Storage (S3-compatible) |
| **Database** | MongoDB (via Mongoose) |
| **Validation** | Joi |
| **File Parsing** | express-fileupload |

---

## 🔄 File Workflow

### 1. Upload Process (POST)
The system follows a sequential pipeline to ensure data integrity:

1.  **Client Request**: The client sends a `multipart/form-data` request containing the file.
2.  **Cloud Upload**: The backend intercepts the file and streams it to **Supabase Storage**.
3.  **URL Generation**: Backend generates a **Signed URL** (e.g., valid for 60 minutes).
4.  **Database Persistence**: The backend saves the file metadata (name, cloud path, size, and URL) into **MongoDB**.


### 2. Retrieval Process (GET)
The system provides synchronized access to stored metadata:

1.  **Database Query**: The backend fetches all files from **MongoDB**.
2.  **Metadata Delivery**: The server returns a JSON array containing the file details and their corresponding URLs.


### 3. Deletion Process (DELETE)
The system follows a safe deletion order:

1.  **Metadata Lookup**: The system fetches the `supabasePath` from MongoDB using the provided ID.
2.  **Cloud Cleanup**: The physical file is removed from **Supabase Storage**.
3.  **DB Finalization**: Only after the cloud file is successfully deleted, the MongoDB record is removed.

---

## 📡 API Endpoints

### Files API
`BASE_URL: /api/file`

| Method | Endpoint | Description | Key Body/Params |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Upload a new file | `file` (Binary) |
| **GET** | `/` | Get all files | - |
| **DELETE** | `/:id` | Delete file from Cloud & DB | `id` (MongoID) |

> **Note**: For private bucket, the `fileURL` returned by the database is a temporary **Signed URL**.

---

## 📊 Performance Analysis
This project uses **0x** to generate Flamegraphs, ensuring that the file-handling middleware and database operations do not block the Node.js Event Loop.



```bash
npx 0x -o server.js

# For detailed function analysis run profiling in PowerShell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npx 0x -o -- node --no-turbo-inlining server.js
