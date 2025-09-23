import { create } from "zustand";
import axios from "axios";

// Set API URL
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/products" : "/api/products";

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,
  message: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ products: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching products", isLoading: false });
      throw error;
    }
  },

  // Fetch single product by ID
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ product: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching product", isLoading: false });
      throw error;
    }
  },

  // Add a new product
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, productData);
      set((state) => ({
        products: [...state.products, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding product", isLoading: false });
      throw error;
    }
  },

  // Update a product
  updateProduct: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? response.data : p)),
        product: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating product", isLoading: false });
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting product", isLoading: false });
      throw error;
    }
  },
}));

export default useProductStore;
