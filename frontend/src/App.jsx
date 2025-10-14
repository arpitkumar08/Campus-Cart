import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";

import MyListings from "./Components/MyListing";
import FavoritesPage from "./Pages/FavoritePage";
import ProductDetails from "./Pages/ProductDetails";
import ChatPage from "./Pages/Chats/ChatPage";

// Admin pages
import AdminLayout from "./Components/Layout/AdminLayout";
import Dashboard from "./Admin/Pages/Dashboard";
import Users from "./Admin/Pages/Users";
import Products from "./Admin/Pages/Products";
import Reports from "./Admin/Pages/Reports";

const App = () => {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/mylisting" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/favourite" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/details/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/chat/:conversationId?" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Routes with persistent sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>

      <Toaster />
    </Router>
  );
};

export default App;
