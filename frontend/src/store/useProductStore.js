import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const useProductStore = create((set, get) => ({
  products: [],
  myProducts: [],
  favorites: [],
  isLoading: false,
  error: null,

  // 🟢 Fetch all products
  fetchProducts: async (page = 1, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });

      set((state) => ({
        products:
          page === 1
            ? res.data.response || []
            : [...state.products, ...(res.data.response || [])],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching products");
    }
  },

  // 🟢 Fetch my listed products
  fetchMyListedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/mylisting`, {
        withCredentials: true,
      });
      set({ myProducts: res.data.products || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Error fetching your listed products");
    }
  },

  // 🟢 Add new product
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
      toast.error(err.response?.data?.message || "Failed to add product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟢 Update product
  updateProduct: async (productId, updatedData) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(
        `${API_URL}/update/${productId}`,
        updatedData,
        {
          withCredentials: true,
        },
      );
      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? res.data : p,
        ),
      }));
      toast.success("Product updated successfully!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟢 Delete product
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
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  },

  // 🟢 Fetch favorites
  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/favorite`, {
        withCredentials: true,
      });
      set({ favorites: res.data.favorites || [], isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      toast.error("Error fetching favorites");
    }
  },

  // 🟢 Mark product as sold
  markAsSold: async (productId) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/markAsSold`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to mark as sold");

      const updatedProduct = await res.json();

      set((state) => ({
        myProducts: state.myProducts.map((p) =>
          p._id === productId ? { ...p, status: "sold" } : p,
        ),
      }));
    } catch (err) {
      console.error("❌ useProductStore: Error marking as sold:", err);
    }
  },

  // 🟢 Toggle favorite
  toggleFavorite: async (productId) => {
    try {
      const res = await axios.post(
        `${API_URL}/favorite/${productId}`,
        {},
        { withCredentials: true },
      );

      // ✅ Option 1: If backend returns updated favorites list
      if (res.data.favorites) {
        set({ favorites: res.data.favorites });
      }
      // ✅ Option 2: If backend just sends success msg
      else {
        await get().fetchFavorites(); // refetch manually
      }

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
      (fav) => fav._id === productId || fav === productId,
    );
    return result;
  },
}));

export default useProductStore;
