import { create } from "zustand";
import axios from "axios";

// Set API URL based on environment
const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

// Include credentials if backend uses cookies
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { fullName, email, password });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {

      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({

        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });

      const { user } = response.data;


      set({ isAuthenticated: true, user, error: null, isLoading: false, });

      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },


  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("❌ Logout error:", error.response?.data || error.message);
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("❌ Verify Email error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {

      const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
      return response.data;
    } catch (error) {
      // console.error("❌ Check Auth error:", error.response?.data || error.message);
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },


  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("❌ Forgot Password error:", error.response?.data || error.message);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("❌ Reset Password error:", error.response?.data || error.message);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));

export default useAuthStore;
