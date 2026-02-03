# General Constructor Web - Backend Setup Guide

Complete guide to run the General Constructor Web project locally.

**Live Demo:** https://general-constructor-web.vercel.app

---

## 🚀 Quick Start (5 minutes)

### Terminal 1 - Start Backend

```bash
cd ~/project/general-constructor-web/backend/http-backend
npm install
node server.js
```

✅ Expected output:
```
MongoDB Connected
Server running on port 5000
```

### Terminal 2 - Start Frontend

```bash
cd ~/project/general-constructor-web/frontend
npm install
npm run dev
```

✅ Expected output:
```
http://localhost:5173
```

### Step 3 - Open Browser

Go to: **http://localhost:5173**

🎉 **Done! Website is running.**

---

## 📋 Detailed Setup

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)

---

### Backend Setup (Detailed)

#### 1. Navigate to backend folder

```bash
cd ~/project/general-constructor-web/backend/http-backend
```

#### 2. Create `.env` file

Create a new file named `.env` in the `http-backend` folder:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/general-constructor?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_123
PORT=5000
```

**⚠️ Important:** Use your real MongoDB URL. Get it from MongoDB Atlas.

#### 3. Install dependencies

```bash
npm install
```

#### 4. Start the backend

```bash
node server.js
```

---

### Frontend Setup (Detailed)

#### 1. Navigate to frontend folder

Open a **new terminal** and run:

```bash
cd ~/project/general-constructor-web/frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Start the development server

```bash
npm run dev
```

You will see:
```
http://localhost:5173
```

---

### Open the Website

Open your browser and visit:

```
http://localhost:5173
```

---

## 🔧 Available API Routes

The backend provides these routes (when running):

| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard & management |
| `/project` | Project CRUD operations |
| `/team` | Team member management |
| `/testimonials` | Client testimonials |
| `/messages` | Contact messages |
| `/quotes` | Quote/estimate management |
| `/reports` | Analytics & reports |
| `/analytics` | Dashboard metrics |
| `/profile` | User profiles |
| `/settings` | App settings |
| `/directory` | Directory store |
| `/resources` | Resource library |
| `/account` | Account management |

---

## ❌ Troubleshooting

### Issue: "MongoDB Connection Error"

**Solution:**
1. Check `.env` file exists in `http-backend` folder
2. Verify `MONGO_URI` is correct (from MongoDB Atlas)
3. Make sure MongoDB network access allows your IP
4. Check internet connection

### Issue: "Port 5000 already in use"

**Solution:**
- Change PORT in `.env` to 5001, 5002, etc.
- Or find and close the process using port 5000

### Issue: "Cannot find module"

**Solution:**
```bash
npm install
```

### Issue: "Admin login not working"

**Solution:**
1. Go to MongoDB Atlas
2. Open your database
3. Find `users` collection
4. Edit your user document
5. Set `"role": "admin"`
6. Refresh browser

### Issue: "Blank page or errors on frontend"

**Solution:**
1. Press `F12` to open browser console
2. Look for error messages
3. Check that backend is running (see terminal for `MongoDB Connected`)
4. Check frontend is running (see terminal for `http://localhost:5173`)

---

## 📁 Backend Project Structure

```
http-backend/
├── models/              # Database schemas
│   ├── admin.js
│   ├── project.js
│   ├── task.js
│   ├── quote.js
│   ├── report.js
│   └── ...
├── routes/              # API routes
│   ├── adminroutes.js
│   ├── projectroutes.js
│   ├── teamroutes.js
│   └── ...
├── middleware/          # Custom middleware
│   └── adminmiddleware.js
├── uploads/            # File uploads
│   └── profiles/
├── server.js           # Main server file
├── package.json
├── .env                # Environment variables (CREATE THIS)
└── README.md           # This file
```

---

## 🌍 Environment Variables

Create `.env` file with:

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/database_name

# Secret key for JWT tokens
JWT_SECRET=your_secret_key_123

# Backend server port
PORT=5000
```

---

## 📦 Dependencies

### Backend (Node.js)
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Frontend (React)
- React 18+
- Vite (build tool)
- React Router
- Other UI libraries

---

## ✨ Features

- 📊 Project dashboard
- 👥 Team management
- 💬 Messaging system
- 📋 Quote tracking
- 📈 Analytics & reports
- 👤 User profiles
- 📁 Resource library

---

## 🐛 Getting Help

1. **Check the console** - Look for red error messages
2. **Check the `.env` file** - Is it in the right location?
3. **Verify MongoDB connection** - Is your URL correct?
4. **Check ports** - Are 5000 and 5173 free?

---

## 📝 Notes

- Backend runs on: **http://localhost:5000**
- Frontend runs on: **http://localhost:5173**
- Keep both terminals open while developing
- Press `Ctrl+C` to stop either server

---

## 🤝 Support

For issues, check:
1. `.env` file configuration
2. MongoDB connection
3. Both backend and frontend are running
4. Browser console for errors (F12)

---

**Last Updated:** February 2, 2026  
**Project:** General Constructor Web
