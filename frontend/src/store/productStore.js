import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

export const useProductStore = create((set, get) => ({
  products: [],
  myProducts: [],   // ✅ User's own listed products
  favorites: [],
  isLoading: false,
  error: null,

  // ✅ Fetch ALL products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/products`);
      set({ products: res.data, isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching products");
    }
  },

  // ✅ Fetch MY listed products
  // inside useProductStore
  fetchMyListedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/products/mylisting`, {
        withCredentials: true,
      });
      set({ myProducts: res.data.products || [], isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching my listed products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching your listed products");
    }
  },


  // ✅ Fetch FAVORITES
  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/favorite`, {
        withCredentials: true,
      });
      set({ favorites: res.data.favorites, isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      set({ isLoading: false });
      toast.error("Error fetching favorites");
    }
  },

  // ✅ Toggle favorite
  toggleFavorite: async (productId) => {
    try {
      const res = await axios.post(
        `${API_URL}/favorite/${productId}`,
        {},
        { withCredentials: true }
      );
      set({ favorites: res.data.favorites });
      toast.success("Favorites updated!");
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
      toast.error(err.response?.data?.message || "Error updating favorites");
    }
  },

  // ✅ Check if product is a favorite
  isFavorite: (productId) => {
    const { favorites } = get();
    const result = favorites.some(
      (fav) => fav._id === productId || fav === productId
    );
    return result;
  },
}));

export default useProductStore;
