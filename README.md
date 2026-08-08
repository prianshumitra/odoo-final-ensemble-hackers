# Diligent Wombat - Modern Realtime Rental Marketplace

A full-stack rental marketplace built with **React 19, TypeScript, Express, MongoDB Atlas, Clerk Authentication, and Socket.io**, featuring real-time product sync, per-user carts, and vendor product listing.

---

## 🛠️ Features & Realtime Architecture

* ⚡ **Realtime Updates (Socket.io)**: When a Vendor lists a new product, it immediately appears on all connected clients' screens in real-time without reloading the page.
* 🔐 **Clerk Authentication**: Seamless Sign In / Sign Up modal and user profile management via `@clerk/clerk-react`.
* 🛒 **Per-User Cart & Persistence**: Each user's cart is tied to their Clerk user identity and saved in MongoDB.
* 🏪 **Vendor Mode & Product Visibility**: Listed products are associated with the vendor and made available across the global product catalog.

---

## 🔑 Environment Setup (What to Provide)

### 1. Frontend Environment Variables (`frontend/.env`)
Create a `.env` file inside the `frontend/` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```
> Get your publishable key from your [Clerk Dashboard](https://dashboard.clerk.com) under **API Keys**.

### 2. Backend Environment Variables (`backend/.env`)
Create/update `.env` inside the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.sp8itln.mongodb.net/diligent_wombat?appName=Cluster0
JWT_SECRET=diligent_wombat_super_secret_jwt_key_2026
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

---

## 🚀 Running the Realtime Application

1. **Start the Realtime Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Client**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser. Open multiple windows/tabs to watch products and vendor listings update live in real-time!