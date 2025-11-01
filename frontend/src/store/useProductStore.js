import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

const useProductStore = create((set, get) => ({
  products: [],
  myProducts: [],
  favorites: [],
  isLoading: false,
  error: null,

  // 🟢 Fetch all products
  fetchProducts: async () => {
    console.log("📡 useProductStore: fetchProducts called");
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/`, { withCredentials: true });
      console.log("✅ useProductStore: API response", res.data);

      set({
        products: res.data.response || [],
        isLoading: false,
      });

      console.log("🧠 useProductStore: products updated", res.data.response?.length);
    } catch (err) {
      console.error("❌ useProductStore: Error fetching products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching products");
    }
  },

  // 🟢 Fetch my listed products
  fetchMyListedProducts: async () => {
    console.log("📡 useProductStore: fetchMyListedProducts called");
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/mylisting`, {
        withCredentials: true,
      });
      console.log("✅ useProductStore: my listed products", res.data.products);
      set({ myProducts: res.data.products || [], isLoading: false });
    } catch (err) {
      console.error("❌ useProductStore: Error fetching my listed products:", err);
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching your listed products");
    }
  },

  // 🟢 Add new product
  addProduct: async (productData) => {
    console.log("🆕 useProductStore: addProduct called", productData);
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/addproduct`, productData, {
        withCredentials: true,
      });
      console.log("✅ useProductStore: product added", res.data);
      set((state) => ({
        myProducts: [res.data, ...state.myProducts],
      }));
      toast.success("Product uploaded successfully!");
      return res.data;
    } catch (err) {
      console.error("❌ useProductStore: Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to add product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟢 Update product
  updateProduct: async (productId, updatedData) => {
    console.log("✏️ useProductStore: updateProduct called", productId, updatedData);
    set({ isLoading: true });
    try {
      const res = await axios.put(`${API_URL}/update/${productId}`, updatedData, {
        withCredentials: true,
      });
      console.log("✅ useProductStore: product updated", res.data);
      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? res.data : p
        ),
      }));
      toast.success("Product updated successfully!");
      return res.data;
    } catch (err) {
      console.error("❌ useProductStore: Error updating product:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟢 Delete product
  deleteProduct: async (productId) => {
    console.log("🗑️ useProductStore: deleteProduct called", productId);
    try {
      await axios.delete(`${API_URL}/deleteproduct/${productId}`, {
        withCredentials: true,
      });
      set((state) => ({
        myProducts: state.myProducts.filter((p) => p._id !== productId),
      }));
      console.log("✅ useProductStore: product deleted", productId);
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("❌ useProductStore: Error deleting product:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  },

  // 🟢 Fetch favorites
  fetchFavorites: async () => {
    console.log("💖 useProductStore: fetchFavorites called");
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/favorite`, { withCredentials: true });
      console.log("✅ useProductStore: favorites fetched", res.data.favorites);
      set({ favorites: res.data.favorites || [], isLoading: false });
    } catch (err) {
      console.error("❌ useProductStore: Error fetching favorites:", err);
      set({ isLoading: false });
      toast.error("Error fetching favorites");
    }
  },

  // 🟢 Mark product as sold
  markAsSold: async (productId) => {
    console.log("🏷️ useProductStore: markAsSold called", productId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}/markAsSold`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to mark as sold");

      const updatedProduct = await res.json();
      console.log("✅ useProductStore: product marked as sold", updatedProduct);

      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? { ...p, status: "sold" } : p
        ),
      }));
    } catch (err) {
      console.error("❌ useProductStore: Error marking as sold:", err);
    }
  },

  // 🟢 Toggle favorite
  toggleFavorite: async (productId) => {
    console.log("❤️ useProductStore: toggleFavorite called", productId);
    try {
      const res = await axios.post(
        `${API_URL}/favorite/${productId}`,
        {},
        { withCredentials: true }
      );
      console.log("✅ useProductStore: favorites updated", res.data.favorites);
      set({ favorites: res.data.favorites });
      toast.success("Favorites updated!");
    } catch (err) {
      console.error("❌ useProductStore: Error toggling favorite:", err);
      toast.error(err.response?.data?.message || "Error updating favorites");
    }
  },

  // 🟢 Check if favorite
  isFavorite: (productId) => {
    const { favorites } = get();
    const result = favorites.some(
      (fav) => fav._id === productId || fav === productId
    );
    console.log(`🔍 useProductStore: isFavorite(${productId}) →`, result);
    return result;
  },
}));

export default useProductStore;
