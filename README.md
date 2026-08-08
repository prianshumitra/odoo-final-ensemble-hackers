# 🚀 EZRent — Modern Rental Marketplace Platform

Welcome to **EZRent**, a full-stack, real-time flexible rental marketplace for furniture, electronics, and tech devices. Built for the **Odoo Hackathon Final**, this platform enables users to rent premium inventory on daily, monthly, or hourly terms with flexible pricing, dynamic color & size variants, real-time stock sync, and a vendor management portal.

---

## 📐 Key Architecture & Features

### 🎨 1. Premium UI Design System & Aesthetics
- **Global Pattern Background:** Full-screen seamless background pattern (`app-bg.jpg`) scaled and fixed globally, visible underneath all floating components.
- **Glassmorphism Everywhere:** Headers, Footers, and Cards use semi-transparent backgrounds (e.g. `bg-[#EFE9F6]/65`, `bg-white/80`) paired with `backdrop-blur` for a modern, frosty depth effect.
- **Cohesive Light Purple Palette:** Custom design system built on crisp `#D4C4ED` / `#C4B2E2` borders, and `#7E3AF2` accent purple.
- **Elevated Navbar:** Sticky navbar with a precise 2px bottom border and subtle black drop shadow to pop against the global background pattern.
- **Custom Sort Selector & Inputs:** Completely custom styled dropdown menus (replacing native `<select>` tags) and newsletter inputs tailored to the app's light purple theme.
- **Dynamic Gradient Hero Banner:** Subtle `1px` gradient border smoothly transitioning from light purple (`#C4B2E2`) to warm off-white (`#EAE4DB`).
- **Custom Price Range Slider:** Tailored HTML range input featuring a dynamic purple gradient track fill (`linear-gradient`), custom thumb knob with drop shadows, and hover micro-animations.

---

### 🛒 2. Interactive Product Catalog & Navigation
- **Smart Click-Outside Detection:** Custom dropdowns (like the Profile Menu and Sort Selector) instantly dismiss when clicking anywhere outside their bounding boxes for seamless UX.
- **Rich Product Cards:**
  - Real-time stock status badge (*Out of Stock* overlay / blurring).
  - Color variant swatches with active selection highlight.
  - Interactive size selection overlay (e.g., TV screen sizes, furniture dimensions).
  - Star rating system, review counts, and formatted rental rates (`Rs. X / per Month/Day`).
  - Quick action buttons: Wishlist toggle (floating heart badge) and Add to Cart.
- **Comprehensive Product Detail Modal:** Deep-dive modal with multi-angle image views, detailed specs, stock status, duration choices, and direct rental actions.

---

### 🔍 3. Real-Time Filtering & Sorting Engine
- **Brand Filter:** Filter products by brand (e.g., Apple, Herman Miller, Sony, Samsung, IKEA).
- **Color Palette Filter:** Visual color swatches allowing single/multi-color filtering.
- **Rental Duration Filter:** Filter by rental frequency (*Monthly*, *Daily*, *Hourly*, *Quarterly*).
- **Interactive Price Range Slider:** Real-time dual-bound price range filtering (Rs. 0 to Rs. 10,000+).
- **Sort Selector:** Instant client-side sorting by *Featured Items*, *Price: Low to High*, *Price: High to Low*, and *Highest Rated ★*.
- **Active Filter Badges:** Quick-dismiss chips to reset or adjust active filters seamlessly.

---

### 🔑 4. Authentication & Role-Based Access Control
- **Clerk Authentication Integration:** Supports multi-provider login (Clerk SDK for Frontend `@clerk/react` & Express Backend `@clerk/express`).
- **Auth Prompt Modal:** Non-intrusive authentication modal prompting users to sign in when attempting restricted actions (e.g., adding vendor items or completing rentals).
- **Profile Dropdown:** Profile menu featuring user details, active orders, vendor dashboard navigation, and sign-out capabilities.

---

### 🏪 5. Vendor Management Portal
- **Vendor Add Product Modal:** Dedicated form modal allowing registered vendors to list new products with images, categories, brands, color variants, stock quantity, and rental pricing.
- **Role-Based Views:** Dynamic UI switching between Customer browsing mode and Vendor management mode.

---

### ⚡ 6. Real-Time WebSockets & API Layer
- **Socket.IO Integration:** Instant real-time updates for product stock changes, order status transitions, and cart updates across connected clients.
- **Fallback Resiliency:** Built-in fallback to mock datasets whenever the backend database connection is offline or initializing.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript 6, Vite 8 |
| **Styling** | Tailwind CSS v4, Framer Motion, Custom CSS variables |
| **Icons & UI** | Lucide React, React Icons, Sonner Toast Notifications |
| **Authentication** | `@clerk/react` (Client), `@clerk/express` (Server), JWT, BcryptJS |
| **State & API** | Axios, TanStack React Query v5, React Hook Form, Zod |
| **Realtime** | Socket.IO Client & Socket.IO Server |
| **Backend Core** | Node.js, Express (ES Modules), TypeScript, `tsx` watcher |
| **Database** | MongoDB / Mongoose ODM |

---

## 📂 Repository Directory Structure

```
odoo-final-ensemble-hackers/
├── backend/                        # Express + TypeScript + MongoDB Server
│   ├── src/
│   │   ├── config/                 # Database configuration (db.ts)
│   │   ├── controllers/            # Auth, Product, Cart, and Rental controllers
│   │   ├── middleware/             # Authentication & Clerk verification
│   │   ├── models/                 # Mongoose Schemas (User, Product, Cart, Rental)
│   │   ├── routes/                 # Express API Endpoints
│   │   ├── scripts/                # Database seed scripts (seed.ts)
│   │   ├── server.ts               # Server entry point & Express app setup
│   │   └── socket.ts               # Socket.IO Realtime server setup
│   ├── .env.example                # Backend environment configuration template
│   ├── package.json                # Server dependencies & scripts
│   └── tsconfig.json               # TypeScript compiler config
│
├── frontend/                       # React 19 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── assets/                 # SVGs, images, and static branding
│   │   ├── components/
│   │   │   ├── common/             # Header, Sidebar, ProductCard, Pagination, ProfileDropdown, AuthPromptModal, ProductDetailModal
│   │   │   └── vendor/             # AddProductModal for vendor listings
│   │   ├── data/                   # Initial product dataset & filter constants
│   │   ├── pages/                  # Home, Account, Orders, Settings, Terms, About, Contact
│   │   ├── services/               # Axios API client (api.ts) & Socket client (socket.ts)
│   │   ├── types/                  # TypeScript Interfaces & Models
│   │   ├── App.tsx                 # Main Application Layout & State Management
│   │   ├── index.css               # Design system tokens & Custom Range Slider CSS
│   │   └── main.tsx                # Entry point with ClerkProvider & BrowserRouter
│   ├── .env.example                # Frontend environment configuration template
│   ├── package.json                # Client dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   └── vite.config.ts              # Vite bundler & plugin configuration
└── README.md                       # Workspace root README
```

---

## 🚀 Getting Started & Local Development

### 📋 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas Connection URI

---

### 1️⃣ Setting Up Environment Variables

#### Backend Environment Setup (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ezrent_db
JWT_SECRET=your_jwt_secret_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

#### Frontend Environment Setup (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

---

### 2️⃣ Installing Dependencies & Running Servers

#### 🔹 Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*The API server will listen on **`http://localhost:5000`**.*

#### 🔹 Start Frontend Server (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*The Vite application will start on **`http://localhost:5173`**.*

---

## 🔌 API Reference Highlights

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | Fetch all available rental products with optional filter query params |
| `/api/products` | `POST` | Create a new rental listing (Vendor Only) |
| `/api/products/:id` | `GET` | Retrieve single product details by ID |
| `/api/auth/me` | `GET` | Get authenticated user profile details |
| `/api/cart` | `GET / POST` | Retrieve or update active user shopping cart |
| `/api/rentals` | `GET / POST` | Manage active rental agreements and order history |

---

## 🎯 Verification & Testing Flow

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Filter inventory using the **Brand**, **Color Palette**, or **Rental Duration** selectors.
3. Test the **Price Range Slider** to see dynamic gradient updates and instant grid filtering.
4. Click on any **Product Card** to open the comprehensive **Product Detail Modal**.
5. Switch color or size swatches to see real-time price and preview adjustments.