import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

export const productStore = create((set, get) => ({
  products: [],
  myProducts: [],
  favorites: [],
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/`);
      set({ products: res.data.response, isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching products");
    }
  },

  // Fetch MY listed products
  fetchMyListedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/mylisting`, {
        withCredentials: true,
      });
      set({ myProducts: res.data.products || [], isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching my listed products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching your listed products");
    }
  },

  // Add new product
  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/addproduct`, productData, {
        withCredentials: true,
      });
      set((state) => ({
        myProducts: [res.data, ...state.myProducts],
      }));
      toast.success("Product uploaded successfully!");
      return res.data;
    } catch (err) {
      console.error("❌ Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to add product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update existing product
  updateProduct: async (productId, updatedData) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`${API_URL}/update/${productId}`, updatedData, {
        withCredentials: true,
      });
      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? res.data : p
        ),
      }));
      toast.success("Product updated successfully!");
      return res.data;
    } catch (err) {
      console.error("❌ Error updating product:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      await axios.delete(`${API_URL}/deleteproduct/${productId}`, {
        withCredentials: true,
      });
      set((state) => ({
        myProducts: state.myProducts.filter((p) => p._id !== productId),
      }));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  },

  // Fetch favorites
  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/favorite`, { withCredentials: true });
      set({ favorites: res.data.favorites, isLoading: false });
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      set({ isLoading: false });
      toast.error("Error fetching favorites");
    }
  },


  // mark as sold

  markAsSold: async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/markAsSold`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 👈 important for cookies
      });

      if (!res.ok) throw new Error("Failed to mark as sold");

      const updatedProduct = await res.json();

      // Update the state immediately
      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? { ...p, status: "sold" } : p
        ),
      }));

      console.log("✅ Product marked as sold:", updatedProduct);
    } catch (err) {
      console.error("❌ Error marking as sold:", err);
    }
  },


  // Toggle favorite
  toggleFavorite: async (productId) => {
    try {
      const res = await axios.post(`${API_URL}/favorite/${productId}`, {}, { withCredentials: true });
      set({ favorites: res.data.favorites });
      toast.success("Favorites updated!");
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
      toast.error(err.response?.data?.message || "Error updating favorites");
    }
  },

  // Check if favorite
  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some((fav) => fav._id === productId || fav === productId);
  },
}));

export default productStore;
