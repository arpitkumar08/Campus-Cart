# Campus Cart

A full-stack, real-time campus marketplace application built with the MERN stack (MongoDB, Express, React, Node.js). Campus Cart allows students to list, discover, and purchase items from each other seamlessly on a centralized platform.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup, login, password reset, and email verification implemented with JWT and bcrypt.
- **Product Management**: Users can create listings, view in-depth product details, and manage their own inventory.
- **Favorites System**: Save products of interest to a dedicated favorites list for easy access later.
- **Real-Time Chat**: Integrated messaging system using Socket.io, allowing buyers and sellers to negotiate and communicate instantly.
- **Reporting System**: Users can report bugs or inappropriate content directly from the platform.
- **Admin Dashboard**: Dedicated admin panel to manage users, monitor active products, and handle platform reports.

### Tech Stack

**Frontend** (Vite + React)
- **Framework**: React 19, React Router DOM
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4, Material UI, Framer Motion
- **Real-Time**: Socket.io-client
- **Data Fetching**: Axios

**Backend** (Node.js + Express)
- **Database**: MongoDB with Mongoose
- **Authentication**: JsonWebToken (JWT), bcrypt
- **Real-Time**: Socket.io
- **Emails**: Nodemailer / Resend / Mailtrap
- **File handling**: Multer

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB cluster or local instance

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/arpitkumar08/Campus-Cart.git
   cd campus-cart
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   ```
   Run the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## 📂 Folder Structure
- `/backend`: Contains the Node.js/Express server, Mongoose models, authentication middleware, unified routing, and Socket.io gateway.
- `/frontend`: Contains the Vite React application, Zustand store configurations, generic and specialized UI components, and Admin dashboard pages.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is open-source.
