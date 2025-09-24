import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

// For adding a product
const ADD_PRODUCT_URL = `${API_URL}/addproduct`;

// For deleting a product
const DELETE_PRODUCT_URL = (id) => `${API_URL}/deleteproduct/${id}`;

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,

  // ✅ Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL); // GET /api/products
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
    }
  },

  // ✅ Add a product
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(ADD_PRODUCT_URL, productData); // POST /api/products/addproduct
      set((state) => ({
        products: [...state.products, response.data.product],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding product",
        isLoading: false,
      });
    }
  },

  // ✅ Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(DELETE_PRODUCT_URL(id)); // DELETE /api/products/deleteproduct/:id
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting product",
        isLoading: false,
      });
    }
  },
}));

export default useProductStore;
