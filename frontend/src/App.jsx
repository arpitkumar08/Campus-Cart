import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import MyListings from "./Components/MyListing";
import FavoritesPage from "./Pages/FavoritePage";
import ProductDetails from "./Pages/ProductDetails";
import ChatPage from "./Pages/Chats/ChatPage";

const App = () => {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/mylisting" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/favourite" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/details/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

        {/* Chat Routes */}
        <Route path="/chat/:conversationId?" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>

      <Toaster />
    </Router>
  );
};

export default App;
