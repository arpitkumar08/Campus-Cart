import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "../store/productStore";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast"; // ✅ toast functions

const ProductUploadModal = ({ onClose }) => {
  const { user } = useAuthStore();
  const { addProduct } = useProductStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    isNegotiable: false,
    condition: "New",
    location: "",
    images: [],
  });

  const categories = [
    "Electronics",
    "Books & Study Materials",
    "Clothing",
    "Furniture",
    "Sports & Fitness",
    "Kitchen & Dining",
    "Musical Instruments",
    "Room Decor",
    "Transportation",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultipleImageChange = (files) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => {
        const combinedFiles = [...prev.images, ...newFiles].slice(0, 3);
        return { ...prev, images: combinedFiles };
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For now, we require at least 0 images since you said images will be done later
    if (formData.images.length < 0) {
      toast.error("⚠️ Please select at least 3 images.");
      return;
    }

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        isNegotiable: formData.isNegotiable,
        condition: formData.condition,
        location: formData.location,
        owner: user._id, // required by backend
        // images can be added later
      };

      await addProduct(productData);

      toast.success("✅ Product uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error uploading product:", error);
      toast.error(error.response?.data?.message || "Failed to upload product");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full max-w-[500px] max-h-screen overflow-auto rounded-2xl shadow-2xl p-[2px]"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-semibold text-center mb-4 border-b border-gray-700 pb-2">
              📦 Upload a Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500 resize-none"
              />

              {/* Category */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Price */}
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              />

              {/* Condition */}
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>

              {/* Location */}
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., College name if student)"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              />

              {/* Negotiable Checkbox */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 rounded border-gray-400"
                />
                Price Negotiable
              </label>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-sm font-medium transition-colors"
                >
                  Upload Product
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductUploadModal;
