# 🎵 Music Streaming Backend

A scalable REST API for a music streaming platform built using **Node.js, Express, and MongoDB**.
Supports authentication, music uploads, and album management with role-based access control.

---

## 🚀 Features

* 🔐 JWT Authentication (User & Artist roles)
* 🎶 Upload music files using ImageKit
* 📀 Create and manage albums
* 🛡️ Role-based authorization (artist-only uploads)
* 🍪 Cookie-based authentication
* 📦 Clean MVC + Service-based architecture

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT (Authentication)
* Multer (File uploads)
* ImageKit (Media storage)

---

## 📂 Project Structure

```
src/
│
├── controllers/
│   ├── auth.controller.js
│   └── music.controller.js
│
├── models/
│   ├── user.model.js
│   ├── music.model.js
│   └── album.model.js
│
├── routes/
│   ├── auth.routes.js
│   └── music.routes.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── services/
│   └── storage.service.js
│
├── db/
│   └── db.js
│
└── app.js
```

---

## ⚙️ Setup Instructions

1. Clone the repository

```
git clone https://github.com/your-username/music-streaming-backend.git
cd music-streaming-backend
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

4. Run the server

```
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Auth Routes

* `POST /auth/register` → Register user
* `POST /auth/login` → Login user
* `POST /auth/logout` → Logout user

---

### 🎵 Music Routes

* `POST /music/upload` → Upload music (Artist only)
* `GET /music` → Get all music (Authenticated users)

---

### 📀 Album Routes

* `POST /music/album` → Create album (Artist only)
* `GET /music/albums` → Get all albums
* `GET /music/albums/:albumId` → Get album by ID

---

## 🔐 Authentication & Roles

* **User** → Can view music & albums
* **Artist** → Can upload music & create albums

---

## 🧠 Future Improvements

* 🎧 Music streaming (audio player)
* ❤️ Like & playlist system
* 🔍 Search functionality
* 📊 Analytics dashboard

---

## 👨‍💻 Author

Sparsh

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
