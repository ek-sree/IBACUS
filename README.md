# 🎓 Student Task Management Portal

A full-stack web application that allows **Teachers** and **Students** to interact via a task management system with **Google/Microsoft login** support, task assignments, submissions, grading, analytics, and file sharing.

---

## 📚 Features

### 🧑‍🏫 Teacher Portal
- Login using Google or Microsoft SSO.
- View dashboard with **4 ApexCharts**:
  - Total students
  - Total tasks
  - Completed tasks
  - Weekly statistics
- Add students:
  - Bulk upload via CSV
  - Manual entry
  - Fields required: `Name`, `Email`, `Class`
- Assign tasks:
  - Assign to individual students or entire classes
  - Attach PDFs or images
  - Set due dates
- View student task submissions
- Grade submissions

### 👨‍🎓 Student Portal
- Login using Google or Microsoft SSO (only if email matches teacher-added emails).
- View assigned tasks with due dates.
- Download task files (PDFs, images).
- Submit task answers (PDFs/images).
- Track weekly task grades on dashboard.

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- TailwindCSS
- Redux Toolkit (State Management)
- Axios + Interceptors (API handling)
- Reusable Components:
  - `ImageInput`
  - `DropDownInput`
  - `DateInput`
- Performance: `useDebounce` for optimized input handling

### Backend
- Node.js + Express.js + TypeScript
- Prisma ORM + SQLite
- Multer (for file uploads)
- Cloudinary (media storage)
- JWT (Authentication)
- Role-based Auth Middleware
- Rate Limiting
- Folder-based Clean Architecture:
  - `Router → Controller → UseCase → Repository`

---

## 📁 Folder Structure Overview

### Frontend (`/client`)
- api/endpoints have all endpoints
- service/*managments have all custom hooks for fetching backend datas


---

## 🔧 Backend

- **Node.js + Express + TypeScript**
- **Prisma ORM** with SQLite
- **JWT Authentication**
- **Multer** for file upload
- **Cloudinary** for media storage
- **Clean Architecture**: Router → Controller → UseCase → Repository
- **Middlewares**:
  - Role-based authorization
  - Access/refresh token regeneration
  - Rate limiting

### 📂 Backend Structure Overview
- server.ts -> src/app/router(handling router) -> controller(accessing data from client) -> useCase(business logic) -> repository(db interaction ,queries)
- src/services have cloudinary config and fucntions.

  
---

## 🔐 Environment Variables

### 📦 Backend `.env`
```env
PORT=3000
DATABASE_URL=sqlite:./dev.db
CORS_KEY=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

MS_CLIENT_ID=your_ms_client_id
TENANT_ID_MS=your_ms_tenant_id

JWT_ACCESS_TOKEN_KEY=your_access_secret
JWT_REFRESH_TOKEN_KEY=your_refresh_secret

CLOUD_NAME=your_cloudinary_cloudname
CLOUD_API_KEY=your_cloudinary_apikey
CLOUD_API_SECRET=your_cloudinary_apisecret 


### 📦 Backend `.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SECRET=your_google_secret
VITE_MS_CLIENT_ID=your_ms_client_id
VITE_ACCESS_TOKEN_LIFETIME=15m
VITE_APP_MODE=development


##Run frontend
cd client
npm install
npm run dev

##Run backend
cd server
npm install
npm run dev

🔁 For production build:
npm run build
npm start
