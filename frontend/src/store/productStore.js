import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

const ADD_PRODUCT_URL = `${API_URL}/addproduct`;
const DELETE_PRODUCT_URL = (id) => `${API_URL}/deleteproduct/${id}`;

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      console.log("🟢 Products fetched from backend:", response.data); // <-- Add this line

      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching products");
    }
  },


  // Add a product (supports images via FormData)
  // Add a product (now sends JSON with Cloudinary URLs)
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(ADD_PRODUCT_URL, productData, {
        headers: { "Content-Type": "application/json" }, // ✅ JSON now
      });

      set((state) => ({
        products: [...state.products, response.data.product],
        isLoading: false,
      }));

      toast.success("✅ Product uploaded successfully!");
      return response.data.product;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding product",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error adding product");
      throw error;
    }
  },


  // Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(DELETE_PRODUCT_URL(id));
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
      toast.success("✅ Product deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting product",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error deleting product");
    }
  },
}));

export default useProductStore;
