# 🎵 Music Streaming Backend

A scalable REST API for a music streaming platform built using **Node.js, Express, and MongoDB**.
Supports authentication, music uploads, album management, efficient audio streaming, and user activity tracking.

---

## 🚀 Features

* 🔐 JWT Authentication (User & Artist roles)
* 🎶 Upload music files using ImageKit
* 📀 Create and manage albums
* 🛡️ Role-based authorization (artist-only uploads)
* 🍪 Cookie-based authentication
* 📦 Clean MVC + Service-based architecture
* ⚡ Chunk-based audio streaming using HTTP Range Requests
* ▶️ Resume & seek support via byte-range streaming
* 📊 Play count tracking for analytics
* 🕘 Recently played history tracking
* ❤️ Like / Unlike songs (toggle system)

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
* `GET /music/:id` → Get music details (includes play count)
* `GET /music/stream/:musicId` → Stream music in chunks

---

### 📀 Album Routes

* `POST /music/album` → Create album (Artist only)
* `GET /music/albums` → Get all albums
* `GET /music/albums/:albumId` → Get album by ID

---

### 🕘 User Activity Routes

* `GET /music/history` → Get recently played songs
* `POST /music/like/:musicId` → Toggle like/unlike song
* `GET /music/liked` → Get liked songs

---

## ⚡ Streaming & Analytics

* 🎧 **Chunk-based streaming**

  * Uses HTTP `Range` headers
  * Returns `206 Partial Content`
  * Enables fast seeking, buffering, and resume playback

* 📊 **Play Count Tracking**

  * Increments only when playback starts (`bytes=0`)
  * Prevents duplicate counting during seek/resume

---

## 🔐 Authentication & Roles

* **User** → Can view, stream, like music & track history
* **Artist** → Can upload music & create albums

---

## 🧠 Future Improvements

* 🔍 Search functionality
* 📊 Advanced analytics dashboard
* 💬 Comments & sharing
* 📱 Frontend integration (React / Next.js)

---

## 👨‍💻 Author

Sparsh

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
