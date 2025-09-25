import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "/api";

export const useProductStore = create((set, get) => ({
  products: [],
  myProducts: [],
  favorites: [],
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    console.log("Fetching all products...");
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/products`);
      console.log("Products fetched:", res.data);
      set({ products: res.data, isLoading: false });
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching products");
    }
  },

  // Fetch favorite products
  fetchFavorites: async () => {
    console.log("Fetching favorite products...");
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/favorite`, { withCredentials: true });
      console.log("Favorites fetched:", res.data.favorites);
      set({ favorites: res.data.favorites, isLoading: false });
    } catch (err) {
      console.error("Error fetching favorites:", err);
      set({ isLoading: false });
      toast.error("Error fetching favorites");
    }
  },

  // Toggle favorite
  toggleFavorite: async (productId) => {
    console.log("Toggling favorite for product ID:", productId);
    try {
      const res = await axios.post(`${API_URL}/favorite/${productId}`, {}, { withCredentials: true });
      console.log("Updated favorites from backend:", res.data.favorites);
      set({ favorites: res.data.favorites });
      toast.success("Updated favorites!");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error(err.response?.data?.message || "Error updating favorites");
    }
  },

  // Check if a product is favorite
  isFavorite: (productId) => {
    const { favorites } = get();
    const result = favorites.some(fav => fav._id === productId || fav === productId);
    console.log(`isFavorite check for ${productId}:`, result);
    return result;
  },
}));

export default useProductStore;
