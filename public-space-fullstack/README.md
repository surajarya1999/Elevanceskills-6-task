# 🌐 Public Space — Full Stack Project

## 📁 Folder Structure
```
project/
├── backend/        ← Express.js API (Node.js, .js files)
└── frontend/       ← Next.js UI (React, TypeScript)
```

---

## 🚀 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your values
npm run dev        # runs on http://localhost:5000
```

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/public-space
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your@gmail.com
EMAIL_PASS=gmail_app_password
FRONTEND_URL=http://localhost:3000
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in .env.local
npm run dev        # runs on http://localhost:3000
```

### Frontend .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login with email |
| POST | /api/auth/verify-otp | Verify Chrome OTP |
| GET | /api/auth/history | Login history |
| GET | /api/users | Get all users |
| POST | /api/users/seed | Load demo users |
| GET | /api/posts | Get all posts |
| POST | /api/posts | Create post |
| POST | /api/posts/:id/like | Like/Unlike |
| POST | /api/posts/:id/comment | Add comment |
| POST | /api/posts/:id/share | Share post |
| POST | /api/friends/add | Add friend |
| POST | /api/friends/remove | Remove friend |
| POST | /api/upload | Upload media |

---

## 🔐 Security Rules

- **Chrome** → OTP verification via email
- **Mobile** → Login only allowed 10:00 AM – 1:00 PM

## 📊 Posting Rules

- 0 friends → Cannot post
- 1 friend → 1 post/day
- 2 friends → 2 posts/day
- 3–10 friends → friends count posts/day
- 10+ friends → Unlimited
