# 🎓 Student Task Management Portal

A full-stack web application that allows **Teachers** and **Students** to interact via a task management system with **Google/Microsoft login** support, task assignments, submissions, grading, analytics, and file sharing.

---


## 🚪 Login Routes

- **👨‍🎓 Student Login** → [`/signin`](http://localhost:5173/signin)
- **👨‍🏫 Teacher Login** → [`/teacher/signin`](http://localhost:5173/teacher/signin)

> These are the main routes for logging into the portal. Teacher and Student will be automatically redirected to their dashboards after login.

---

## 📚 Features

### 🧑‍🏫 Teacher Portal
- Login using Google or Microsoft SSO.
- View dashboard with **4 ApexCharts**:
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
```


### 📦 Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SECRET=your_google_secret
VITE_MS_CLIENT_ID=your_ms_client_id
VITE_ACCESS_TOKEN_LIFETIME=15m
VITE_APP_MODE=development
```

##Run frontend
```
cd client
npm install
npm run dev
```

##Run backend
```
cd server
npm install
npm run dev
```

🔁 For production build:
```
npm run build
npm start
```

### 👨‍🏫 Teacher Route
![Screenshot (432)](https://github.com/user-attachments/assets/ffa12029-a4a5-42b5-b2aa-d57b88737a42)
![Screenshot (416)](https://github.com/user-attachments/assets/e08b0f93-3884-4ec5-bd5a-8610e3086120)
![Screenshot (417)](https://github.com/user-attachments/assets/de1cfce1-a7f4-4532-9ee6-a72f5ced37ae)
![Screenshot (418)](https://github.com/user-attachments/assets/998ce024-3800-4eea-9d4d-a479240ed5a9)
![Screenshot (419)](https://github.com/user-attachments/assets/c6edb47b-9bf1-433a-a1ba-ae1ca4994624)
![Screenshot (420)](https://github.com/user-attachments/assets/f407f5ef-0ed0-40c3-b1f6-d7cb30575c96)
![Screenshot (421)](https://github.com/user-attachments/assets/cf83b56a-97d7-4fad-94e3-abf011499b5c)
![Screenshot (422)](https://github.com/user-attachments/assets/fb7c9545-62e8-441b-808f-08f3c4953273)
![Screenshot (423)](https://github.com/user-attachments/assets/b0730630-60cf-4104-b6ae-5692b6f6ce26)
![Screenshot (424)](https://github.com/user-attachments/assets/1ecbf38b-c948-4012-88f8-22a9e71f2c67)
![Screenshot (425)](https://github.com/user-attachments/assets/c1fb7e32-f5f5-4497-9330-aea67d68b96c)
![Screenshot (427)](https://github.com/user-attachments/assets/ad2107fb-176d-45af-b28d-6c9842c092d4)
![Screenshot (428)](https://github.com/user-attachments/assets/d3854a55-4b14-4cfc-aa4f-5dd02c507f23)
![Screenshot (429)](https://github.com/user-attachments/assets/7947a5e6-860a-4e15-a2c7-7be5e5034582)
![Screenshot (430)](https://github.com/user-attachments/assets/a04da084-1ee3-4147-afab-7b39b6af0387)
![Screenshot (431)](https://github.com/user-attachments/assets/b81a4eb1-999e-4ae5-b9bb-2bf8d54d3131)

### 👨‍🏫 Student Route
![Screenshot (433)](https://github.com/user-attachments/assets/a51164ee-f493-4e06-a103-05c5c6c5257a)
![Screenshot (434)](https://github.com/user-attachments/assets/87bd3afd-3f15-4282-ba84-fed76941c6c3)
![Screenshot (435)](https://github.com/user-attachments/assets/c39092e5-6001-49d6-983a-e59cedc7eb0c)
![Screenshot (436)](https://github.com/user-attachments/assets/aa0e4464-9706-411b-a705-fc1ee360e709)
![Screenshot (438)](https://github.com/user-attachments/assets/7d26787a-0de5-4de3-932a-7cd47bfe6a43)

