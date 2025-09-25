import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

const ADD_PRODUCT_URL = `${API_URL}/addproduct`;
const DELETE_PRODUCT_URL = (id) => `${API_URL}/deleteproduct/${id}`;
const MY_LISTED_PRODUCTS_URL = `${API_URL}/mylisting`; // ✅ new endpoint

export const useProductStore = create((set) => ({
  products: [],        // All products
  myProducts: [],      // ✅ Only products added by logged-in user
  product: null,
  isLoading: false,
  error: null,

  // ✅ Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      console.log("🟢 Products fetched from backend:", response.data);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching products",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error fetching products");
    }
  },

  fetchMyListedProducts: async (ownerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(MY_LISTED_PRODUCTS_URL, {
        params: { owner: ownerId },
      });

      // Extract the array
      set({ myProducts: response.data.products, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error fetching your listed products",
        isLoading: false,
      });
    }
  },


  // ✅ Add a product
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(ADD_PRODUCT_URL, productData, {
        headers: { "Content-Type": "application/json" },
      });

      set((state) => ({
        products: [response.data.product, ...state.products],
        myProducts: [response.data.product, ...state.myProducts], // add to personal list too
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

  // ✅ Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(DELETE_PRODUCT_URL(id));
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        myProducts: state.myProducts.filter((p) => p._id !== id),
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



  isFavorite: async => {}
}));

export default useProductStore;
