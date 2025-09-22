import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";

const App = () => {

  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => { checkAuth(); }, []);

  return (
    <Router>
      <Routes>
        {/* Protected Home page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Auth pages */}
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
