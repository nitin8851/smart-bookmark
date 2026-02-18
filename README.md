# 🔖 Smart Bookmark

A modern bookmark manager built using **Next.js, Supabase, and Tailwind CSS**.  
Users can securely log in with Google, add bookmarks, and delete their own bookmarks in real time.

---

## 🚀 Live Demo

👉 https://smart-bookmark-theta-inky.vercel.app

---

## ✨ Features

- 🔐 Google Authentication (Supabase OAuth)
- ➕ Add bookmarks
- ❌ Delete your own bookmarks
- 👤 User-specific data (Row Level Security)
- ⚡ Real-time updates
- 🌙 Modern dark UI
- ☁️ Deployed on Vercel

---

## 🛠 Tech Stack

- Next.js 16
- Supabase (Database + Auth + Realtime)
- Tailwind CSS
- TypeScript
- Vercel (Deployment)

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/nitin8851/smart-bookmark.git
cd smart-bookmark
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create Environment Variables

Create a file named `.env.local` in the root folder and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
```

You can find these inside:

Supabase Dashboard → Settings → API Keys

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 Security

- Row Level Security (RLS) enabled
- Users can only access and modify their own bookmarks

---

## 🌍 Deployment

The project is deployed on **Vercel**.

Production URL:
👉 https://smart-bookmark-theta-inky.vercel.app

---

## 👨‍💻 Author

Nitin Jha  
GitHub: https://github.com/nitin8851
