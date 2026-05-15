# 💬 Chatify — Real-Time Chat Application

<div align="center">

**A modern, production-ready real-time chat application built with React, Node.js, Socket.io & MongoDB**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black?style=for-the-badge&logo=socket.io)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

![Demo App](/frontend/public/screenshot-for-readme.png)

## ✨ Features

- 🔐 **Secure Authentication**: Custom JWT-based auth with HTTP-only cookies and bcrypt hashing.
- ⚡ **Real-Time Messaging**: Instant delivery and synchronization using Socket.io.
- 🟢 **Online Presence**: Live status indicators to see who is currently active.
- 🔔 **Interactive UI**: Sound notifications for new messages and a beautiful glassmorphism design.
- 🖼️ **Media Support**: Send text and images seamlessly with Cloudinary integration.
- 📨 **User Onboarding**: Automatic welcome emails sent upon registration via Resend.
- 🚦 **Security First**: API rate-limiting and bot protection powered by Arcjet.
- 🧠 **Global State**: Managed efficiently with Zustand for a smooth user experience.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, DaisyUI, Lucide React, Axios, Zustand, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Mongoose (MongoDB), Cloudinary, Resend, Arcjet.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** v20.0.0+
- **npm** v9+
- Accounts for: **MongoDB Atlas**, **Cloudinary**, **Resend**, and **Arcjet**.

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/ItsGBishal/Real-Time-Chat-Application.git
cd chatify-master

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Environment

Create a `.env` file in the `backend/` directory based on the following template:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_KEY=your_arcjet_key
```

### Step 3: Run the App

Open **two** terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License.

<div align="center">
  Made with ❤️ by ItsGBishal
</div>
