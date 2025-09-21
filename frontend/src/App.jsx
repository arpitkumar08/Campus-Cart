// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />

        {/* Forgot Password page */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Verify Email Page */}
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
