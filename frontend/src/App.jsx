import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/useAuthStore";
import AdminLayout from "./Components/Layout/AdminLayout";

// Lazy Loaded Pages
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const ForgotPasswordPage = React.lazy(
  () => import("./pages/Auth/ForgotPasswordPage"),
);
const EmailVerificationPage = React.lazy(
  () => import("./pages/Auth/EmailVerificationPage"),
);
const ResetPasswordPage = React.lazy(
  () => import("./Pages/Auth/ResetPasswordPage"),
);

const MyListings = React.lazy(() => import("./Components/MyListing"));
const FavoritesPage = React.lazy(() => import("./Pages/FavoritePage"));
const ProductDetails = React.lazy(() => import("./Pages/ProductDetails"));
const ChatPage = React.lazy(() => import("./Pages/Chats/ChatPage"));

// Lazy Loaded Admin Pages
const Dashboard = React.lazy(() => import("./Admin/Pages/Dashboard"));
const Users = React.lazy(() => import("./Admin/Pages/Users"));
const Products = React.lazy(() => import("./Admin/Pages/Products"));
const Reports = React.lazy(() => import("./Admin/Pages/Reports"));

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        }
      >
        <Routes>
          {/* User Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylisting"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourite"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:conversationId?"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Admin Routes with persistent sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="reports" element={<Reports />} />
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </Suspense>

      <Toaster />
    </Router>
  );
};

export default App;
