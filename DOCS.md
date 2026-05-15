# 💬 Chatify — Complete Developer Documentation

<div align="center">

**A modern, production-ready real-time chat application built with React, Node.js, Socket.io & MongoDB**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black?style=for-the-badge&logo=socket.io)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Project Architecture](#-project-architecture)
3. [API Reference](#-api-reference)
4. [Socket.io Events](#-socketio-events)
5. [Database Schemas](#-database-schemas)
6. [Environment Variables](#-environment-variables-setup)
7. [Quick Start](#-quick-start-local-development)
8. [UI Architecture & Design System](#-ui-architecture--design-system)
9. [Authentication Flow](#-authentication-flow)
10. [Real-Time Messaging Flow](#-real-time-messaging-flow)
11. [Tech Stack](#-tech-stack-summary)
12. [Production Build & Deployment](#-production-build--deployment)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure custom JWT auth stored in HTTP-only cookies (no third-party auth) |
| ⚡ **Real-Time Messaging** | Instant message delivery via Socket.io |
| 🟢 **Online Presence** | Live online/offline status indicators for all users |
| 🔔 **Notification Sounds** | Audio alerts for new messages (toggleable per-user preference) |
| 📨 **Welcome Emails** | Automated welcome email sent on signup via Resend |
| 🖼️ **Image Uploads** | Upload and send images via Cloudinary CDN |
| 🗂️ **Dual-Tab Sidebar** | Switch between "Chats" (existing conversations) and "Contacts" (all users) |
| ⚡ **Optimistic UI** | Messages appear instantly before server confirmation |
| 🚦 **Rate Limiting** | API protection via Arcjet to prevent abuse and spam |
| 🎨 **Glassmorphism UI** | Beautiful dark UI with animated border effects, Tailwind CSS & DaisyUI |
| 🧠 **Zustand State** | Lightweight global state management with no boilerplate |
| 🚀 **Production Ready** | Serves frontend static files from backend in production mode |

---

## 🏗️ Project Architecture

```
chatify-master/
├── backend/                        # Node.js + Express API Server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Signup, Login, Logout, Update Profile
│   │   │   └── message.controller.js   # Contacts, Chats, Messages, Send
│   │   ├── emails/
│   │   │   ├── emailHandlers.js        # Email dispatch logic (Resend)
│   │   │   └── emailTemplates.js       # HTML email templates
│   │   ├── lib/
│   │   │   ├── arcjet.js               # Arcjet rate-limit SDK config
│   │   │   ├── cloudinary.js           # Cloudinary SDK setup
│   │   │   ├── db.js                   # MongoDB connection via Mongoose
│   │   │   ├── env.js                  # Typed environment variable exports
│   │   │   ├── resend.js               # Resend email client init
│   │   │   ├── socket.js               # Socket.io server + online users map
│   │   │   └── utils.js                # JWT token generator helper
│   │   ├── middleware/
│   │   │   ├── arcjet.middleware.js     # Rate-limit middleware (applied first)
│   │   │   ├── auth.middleware.js       # JWT cookie verification middleware
│   │   │   └── socket.auth.middleware.js # Socket.io connection auth middleware
│   │   ├── models/
│   │   │   ├── User.js                 # Mongoose User schema
│   │   │   └── Message.js              # Mongoose Message schema
│   │   ├── routes/
│   │   │   ├── auth.route.js           # /api/auth endpoints
│   │   │   └── message.route.js        # /api/messages endpoints
│   │   └── server.js                   # Express app entry point
│   ├── .env                            # Environment variables (never commit!)
│   └── package.json
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   │   ├── sounds/
│   │   │   └── notification.mp3        # Notification sound effect
│   │   ├── login.png                   # Login page illustration
│   │   └── screenshot-for-readme.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActiveTabSwitch.jsx     # Chats / Contacts tab toggle
│   │   │   ├── BorderAnimatedContainer.jsx  # Animated gradient border wrapper
│   │   │   ├── ChatContainer.jsx       # Main chat message display area
│   │   │   ├── ChatHeader.jsx          # Selected user info + online indicator
│   │   │   ├── ChatsList.jsx           # List of existing conversations
│   │   │   ├── ContactList.jsx         # Full contacts directory
│   │   │   ├── MessageInput.jsx        # Text + image message composer
│   │   │   ├── MessagesLoadingSkeleton.jsx  # Loading placeholder for messages
│   │   │   ├── NoChatHistoryPlaceholder.jsx # Empty state for new conversations
│   │   │   ├── NoChatsFound.jsx        # Empty state for no chats
│   │   │   ├── NoConversationPlaceholder.jsx # Default right panel state
│   │   │   ├── PageLoader.jsx          # Full-page loading spinner
│   │   │   ├── ProfileHeader.jsx       # Avatar, name, logout, profile pic update
│   │   │   └── UsersLoadingSkeleton.jsx # Loading placeholder for user lists
│   │   ├── hooks/                      # Custom React hooks directory
│   │   ├── lib/
│   │   │   └── axios.js                # Axios instance with base URL config
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx            # Main chat layout (sidebar + chat area)
│   │   │   ├── LoginPage.jsx           # Login form + illustration
│   │   │   └── SignUpPage.jsx          # Registration form + illustration
│   │   ├── store/
│   │   │   ├── useAuthStore.js         # Auth state: login, signup, socket mgmt
│   │   │   └── useChatStore.js         # Chat state: messages, contacts, sending
│   │   ├── App.jsx                     # Route definitions + background decorators
│   │   ├── index.css                   # Global Tailwind base + custom CSS classes
│   │   └── main.jsx                    # React app entry point
│   ├── tailwind.config.js              # DaisyUI + custom border animation
│   ├── vite.config.js                  # Vite dev server config
│   └── package.json
│
└── package.json                    # Root: build & start scripts for production
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`
> All auth routes are protected by **Arcjet rate limiting** before any processing.

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/signup` | ❌ | Register a new user, sends welcome email |
| `POST` | `/api/auth/login` | ❌ | Log in, sets HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | ❌ | Clears the JWT cookie |
| `PUT` | `/api/auth/update-profile` | ✅ | Upload new profile picture to Cloudinary |
| `GET` | `/api/auth/check` | ✅ | Verify JWT and return current user object |

#### `POST /api/auth/signup` — Request Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}
```
**Response (201):**
```json
{
  "_id": "64abc123...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": ""
}
```

#### `POST /api/auth/login` — Request Body
```json
{
  "email": "john@example.com",
  "password": "mypassword"
}
```
**Response (200):** Same user object as signup. JWT set as `HttpOnly` cookie.

#### `PUT /api/auth/update-profile` — Request Body
```json
{
  "profilePic": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
}
```
> The `profilePic` field must be a base64-encoded data URL. The server uploads it to Cloudinary and stores the CDN URL.

---

### Message Routes — `/api/messages`
> All message routes require **JWT authentication** + **Arcjet rate limiting**. Rate limiting runs first (more efficient — rejects unauthenticated spam before hitting auth logic).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages/contacts` | Get all registered users (excluding self) |
| `GET` | `/api/messages/chats` | Get users you have had conversations with |
| `GET` | `/api/messages/:id` | Get full message history with user `:id` |
| `POST` | `/api/messages/send/:id` | Send a message (text and/or image) to user `:id` |

#### `POST /api/messages/send/:id` — Request Body
```json
{
  "text": "Hello there!",
  "image": "data:image/png;base64,..."
}
```
> At least one of `text` or `image` is required. Sending to yourself returns `400`. Non-existent receiver returns `404`.

**Response (201):**
```json
{
  "_id": "64xyz789...",
  "senderId": "64abc123...",
  "receiverId": "64def456...",
  "text": "Hello there!",
  "image": "https://res.cloudinary.com/...",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

---

## 📡 Socket.io Events

> Socket connections are authenticated via the `socket.auth.middleware.js` — it reads the JWT from the HTTP cookie on the handshake request. Unauthenticated connections are rejected.

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connection` | Client → Server | JWT cookie (automatic) | Establishes authenticated socket, adds user to online map |
| `getOnlineUsers` | Server → **All Clients** | `string[]` (userIds) | Broadcast updated list of online user IDs |
| `newMessage` | Server → **Receiver Only** | `Message` object | Push real-time message directly to the recipient's socket |
| `disconnect` | Client → Server | — | Removes user from online map, re-broadcasts presence update |

**Online Users Map (in-memory):**
```javascript
// { userId: socketId }
const userSocketMap = {};
```

---

## 🗄️ Database Schemas

### User Schema (`models/User.js`)
```javascript
{
  fullName:   String   // required
  email:      String   // required, unique index
  password:   String   // required, min 6 chars, bcrypt hashed (salt=10)
  profilePic: String   // Cloudinary CDN URL, default: ""
  createdAt:  Date     // auto-generated (Mongoose timestamps)
  updatedAt:  Date     // auto-generated (Mongoose timestamps)
}
```

### Message Schema (`models/Message.js`)
```javascript
{
  senderId:   ObjectId → User  // required, ref: "User"
  receiverId: ObjectId → User  // required, ref: "User"
  text:       String           // max 2000 chars, trimmed (optional)
  image:      String           // Cloudinary CDN URL (optional)
  createdAt:  Date             // auto-generated
  updatedAt:  Date             // auto-generated
}
```

---

## 🔑 Environment Variables Setup

### Backend — `backend/.env`

```env
# ── Server ─────────────────────────────────────
PORT=3000
NODE_ENV=development

# ── Database ────────────────────────────────────
# Get from: https://cloud.mongodb.com → Cluster → Connect → Drivers
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatify_db?appName=Cluster0

# ── JWT ─────────────────────────────────────────
# Use a strong random string (min 32 chars recommended)
JWT_SECRET=your_very_long_random_secret_key_here

# ── Email via Resend ────────────────────────────
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FORM=onboarding@resend.dev
EMAIL_FORM_NAME=Chatify

# ── Frontend URL (CORS + email links) ───────────
CLIENT_URL=http://localhost:5173

# ── Cloudinary (Image Uploads) ──────────────────
# Get from: https://cloudinary.com/console → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Arcjet (Rate Limiting) ──────────────────────
# Get from: https://app.arcjet.com → Sites → API Keys
ARCJET_KEY=ajkey_xxxxxxxxxxxxxxxxxxxxxxxx
ARCJET_ENV=development
```

> **Where to get your API keys:**
> | Service | URL |
> |---------|-----|
> | MongoDB Atlas | [cloud.mongodb.com](https://cloud.mongodb.com) → Create Cluster → Connect |
> | Cloudinary | [cloudinary.com/console](https://cloudinary.com/console) → Dashboard |
> | Resend | [resend.com/api-keys](https://resend.com/api-keys) |
> | Arcjet | [app.arcjet.com](https://app.arcjet.com) → Sites → API Keys |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** v20.0.0 or higher (`node --version` to check)
- **npm** v9+ (`npm --version` to check)
- Active accounts for: MongoDB Atlas, Cloudinary, Resend, Arcjet

### Step 1 — Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/chatify.git
cd chatify-master

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2 — Configure Environment

```bash
cd backend
# Edit the .env file and fill in all your credentials
# (see Environment Variables section above for the full template)
```

### Step 3 — Start Development Servers

Open **two separate terminal windows**:

**Terminal 1 — Backend:**
```bash
cd chatify-master/backend
npm run dev
# ✅ Output: Server running on port: 3000
```

**Terminal 2 — Frontend:**
```bash
cd chatify-master/frontend
npm run dev
# ✅ Output: Local: http://localhost:5173
```

### Step 4 — Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

> **Note:** The backend must be running on port `3000` for the frontend to connect. The Axios base URL is `http://localhost:3000` in development mode.

---

## 🎨 UI Architecture & Design System

### Design Language
The app uses a **dark glassmorphism** aesthetic built on Tailwind CSS 3.x + DaisyUI 4.x.

### Color Tokens

| Token | Tailwind Value | Usage |
|-------|----------------|-------|
| Page Background | `bg-slate-900` | Full-page dark background |
| Sidebar Glass | `bg-slate-800/50` + `backdrop-blur-sm` | Frosted glass left panel |
| Chat Area Glass | `bg-slate-900/50` + `backdrop-blur-sm` | Frosted glass right panel |
| Glow Left | `bg-pink-500 opacity-20 blur-[100px]` | Top-left ambient glow decorator |
| Glow Right | `bg-cyan-500 opacity-20 blur-[100px]` | Bottom-right ambient glow decorator |
| Grid Pattern | `linear-gradient` | Subtle dot/grid background texture |
| Text Primary | `text-slate-200` | Headings, body text |
| Text Muted | `text-slate-400` | Labels, placeholders, hints |
| Accent | `text-cyan-400` | Taglines, active states |

### Animated Border Effect
The `BorderAnimatedContainer` component wraps all major layouts (Login, Signup, Chat) with a rotating gradient border using a custom Tailwind animation:

```javascript
// tailwind.config.js
animation: { border: "border 4s linear infinite" },
keyframes: { border: { to: { "--border-angle": "360deg" } } }
```

### Page Layout Map

```
App.jsx  (slate-900 background + pink/cyan glow decorators + grid overlay)
│
├── /login    →  LoginPage.jsx
│                ├── Left half:  Login form (email, password, submit)
│                └── Right half: login.png illustration + feature badges
│                                (Free | Easy Setup | Private)
│
├── /signup   →  SignUpPage.jsx
│                ├── Left half:  Signup form (fullName, email, password)
│                └── Right half: Illustration + feature highlights
│
└── /  (auth required)  →  ChatPage.jsx
     │
     ├── Left Panel (w-80, slate-800/50 glass):
     │    ├── ProfileHeader.jsx
     │    │    └── Avatar, full name, logout button, click-to-update profile pic
     │    ├── ActiveTabSwitch.jsx
     │    │    └── "Chats" tab | "Contacts" tab
     │    └── Scrollable List:
     │         ├── ChatsList.jsx      (when activeTab === "chats")
     │         └── ContactList.jsx    (when activeTab === "contacts")
     │
     └── Right Panel (flex-1, slate-900/50 glass):
          ├── ChatContainer.jsx       (when selectedUser !== null)
          │    ├── ChatHeader.jsx     (avatar, name, 🟢 online indicator)
          │    ├── Message scroll area
          │    │    ├── Text bubbles (sender right, receiver left)
          │    │    └── Image attachments (Cloudinary URLs)
          │    └── MessageInput.jsx   (text field + image upload button)
          └── NoConversationPlaceholder.jsx  (default empty state)
```

### Custom CSS Classes (`src/index.css`)

| Class | Used In | Description |
|-------|---------|-------------|
| `.auth-input-label` | Login, Signup forms | Styled `<label>` above each input |
| `.auth-input-icon` | Login, Signup forms | Absolute-positioned icon inside input |
| `.input` | Login, Signup forms | Styled `<input>` field (full width, dark) |
| `.auth-btn` | Login, Signup forms | Primary gradient submit button |
| `.auth-link` | Login, Signup forms | Cyan-colored navigation link |
| `.auth-badge` | Login, Signup pages | Pill-shaped feature highlight badge |

---

## 🔐 Authentication Flow

```
─── SIGNUP ─────────────────────────────────────────────────────────────────
Client: POST /api/auth/signup  { fullName, email, password }
    │
    ├── [Arcjet] Rate limit check
    ├── Validate all fields present
    ├── Validate email format (regex)
    ├── Check email not already in DB
    ├── bcrypt.hash(password, salt=10)
    ├── newUser.save()  → MongoDB
    ├── generateToken(userId) → Set HttpOnly JWT cookie (15 days)
    ├── Response: { _id, fullName, email, profilePic }
    └── sendWelcomeEmail()  → Resend (async, non-blocking)

Frontend:
    └── set authUser → connectSocket() → navigate to "/"

─── LOGIN ──────────────────────────────────────────────────────────────────
Client: POST /api/auth/login  { email, password }
    │
    ├── [Arcjet] Rate limit check
    ├── User.findOne({ email })
    ├── bcrypt.compare(password, user.password)
    ├── generateToken(userId) → Set HttpOnly JWT cookie
    └── Response: { _id, fullName, email, profilePic }

Frontend:
    └── set authUser → connectSocket() → navigate to "/"

─── AUTH CHECK (on every app load) ─────────────────────────────────────────
Client: GET /api/auth/check  (cookie sent automatically)
    │
    ├── [protectRoute middleware] Verify JWT from cookie
    ├── User.findById(decoded.userId).select("-password")
    └── Response: full user object  OR  401

Frontend:
    ├── Success → set authUser, connectSocket()
    └── Failure → set authUser: null  →  redirect to /login
```

---

## ⚡ Real-Time Messaging Flow

```
─── OPENING A CONVERSATION ──────────────────────────────────────────────────
User clicks a contact or chat:
    ├── setSelectedUser(user)
    ├── getMessagesByUserId(user._id)
    │    └── GET /api/messages/:id  →  fetch full history from MongoDB
    └── subscribeToMessages()
         └── socket.on("newMessage", handler)

─── SENDING A MESSAGE ────────────────────────────────────────────────────────
User submits text / image:
    │
    ├── [Optimistic Update] Immediately append temp message to UI
    │    (tempId = "temp-{Date.now()}", isOptimistic: true)
    │
    ├── POST /api/messages/send/:receiverId  { text?, image? }
    │    ├── [Arcjet] Rate limit
    │    ├── [protectRoute] Auth check
    │    ├── Validate text or image present
    │    ├── If image: cloudinary.uploader.upload(base64)
    │    ├── Save Message to MongoDB
    │    ├── getReceiverSocketId(receiverId)
    │    └── io.to(socketId).emit("newMessage", savedMessage)
    │
    ├── Success → replace optimistic msg with confirmed server response
    └── Failure → remove optimistic msg, show toast error

─── RECEIVING A MESSAGE (real-time) ─────────────────────────────────────────
Receiver's socket:
    └── socket.on("newMessage", newMessage)
         ├── Check: newMessage.senderId === selectedUser._id  (ignore others)
         ├── Append message to messages array
         └── If isSoundEnabled → play /sounds/notification.mp3

─── PRESENCE UPDATES ─────────────────────────────────────────────────────────
On connect:   io.emit("getOnlineUsers", Object.keys(userSocketMap))
On disconnect: delete userSocketMap[userId]
               io.emit("getOnlineUsers", Object.keys(userSocketMap))

Frontend: socket.on("getOnlineUsers") → set onlineUsers[]
UI: user avatar shows 🟢 if user._id in onlineUsers[]
```

---

## 📦 Tech Stack Summary

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21 | HTTP server & routing framework |
| `socket.io` | ^4.8 | Real-time bidirectional WebSocket communication |
| `mongoose` | ^8.10 | MongoDB object modeling (ODM) |
| `jsonwebtoken` | ^9.0 | JWT generation & verification |
| `bcryptjs` | ^2.4 | Password hashing with salt |
| `cloudinary` | ^2.5 | Image upload & CDN delivery |
| `resend` | ^6.0 | Transactional email API |
| `@arcjet/node` | ^1.0-beta | API rate limiting & bot protection |
| `cookie-parser` | ^1.4 | Parse HTTP-only cookies from requests |
| `cors` | ^2.8 | Cross-origin request headers |
| `dotenv` | ^16.4 | Load environment variables from `.env` |
| `nodemon` | ^3.1 | Auto-restart server in development |

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.1 | UI component library |
| `react-dom` | ^19.1 | React DOM renderer |
| `react-router` | ^7.8 | Client-side routing (SPA navigation) |
| `zustand` | ^5.0 | Minimal global state management |
| `socket.io-client` | ^4.8 | WebSocket client for real-time events |
| `axios` | ^1.11 | HTTP client with base URL & interceptors |
| `lucide-react` | ^0.542 | Consistent icon library (SVG-based) |
| `react-hot-toast` | ^2.6 | Non-blocking toast notifications |
| `tailwindcss` | ^3.4 | Utility-first CSS framework |
| `daisyui` | ^4.12 | Tailwind-based UI component library |
| `vite` | ^7.1 | Lightning-fast dev server & bundler |

---

## 🏭 Production Build & Deployment

### Build for Production

```bash
# From the root directory — installs all deps & builds the frontend
npm run build
```

This root script chains:
1. `npm install --prefix backend` — install backend deps
2. `npm install --prefix frontend` — install frontend deps
3. `npm run build --prefix frontend` — Vite builds to `frontend/dist/`

### Start Production Server

```bash
# From the root directory
npm start
```

In production (`NODE_ENV=production`), the Express server serves the Vite-built React app from `frontend/dist/`. This means **only one port** is needed in production.

```javascript
// server.js — production static serving
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
```

### Production `.env` Updates

```env
NODE_ENV=production
CLIENT_URL=https://your-production-domain.com
PORT=3000
JWT_SECRET=<strong-random-64-char-string>
ARCJET_ENV=production
```

### Deployment Checklist

- [ ] `NODE_ENV=production` in backend `.env`
- [ ] `CLIENT_URL` updated to your production domain
- [ ] `JWT_SECRET` is a strong, random string (min 32 chars)
- [ ] MongoDB Atlas IP allowlist configured (or `0.0.0.0/0` for cloud)
- [ ] Cloudinary credentials confirmed working
- [ ] Resend domain verified (for custom sender email)
- [ ] `ARCJET_ENV=production` set

### Deploying to Sevalla (Free Tier — Recommended)

1. Push your code to GitHub
2. Create an account at [Sevalla](https://sevalla.com) and connect your repo
3. Configure the application:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `/` (project root)
4. Add all environment variables in the Sevalla dashboard
5. Click **Deploy** 🚀

### Other Deployment Options

| Platform | Notes |
|----------|-------|
| **Railway** | Connect GitHub repo, add env vars, auto-detects `npm start` |
| **Render** | Free tier available; set build & start commands as above |
| **Fly.io** | Good WebSocket support for Socket.io |
| **VPS (Ubuntu)** | Use PM2 to manage the Node process in production |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request against `main`

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  Made with ❤️ using React 19, Node.js, Socket.io & MongoDB
</div>
