import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useProductStore from "../store/productStore";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ProductUploadModal = ({ onClose, product = null, isEdit = false }) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const { user } = useAuthStore();
  const { addProduct, updateProduct } = useProductStore();

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

  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price || "",
        isNegotiable: product.isNegotiable || false,
        condition: product.condition || "New",
        location: product.location || "",
        images: product.images || [],
      });
    }
  }, [isEdit, product]);

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
        const combined = [...prev.images, ...newFiles].slice(0, 3);
        return { ...prev, images: combined };
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please select at least 1 image.");
      return;
    }

    try {
      setLoading(true);
      const uploadedUrls = [];

      for (const img of formData.images) {
        if (img instanceof File) {
          const fd = new FormData();
          fd.append("file", img);
          fd.append("upload_preset", uploadPreset);
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: fd }
          );
          const file = await res.json();
          uploadedUrls.push(file.secure_url);
        } else {
          uploadedUrls.push(img);
        }
      }

      const data = {
        ...formData,
        images: uploadedUrls,
        owner: user._id,
      };

      if (isEdit) {
        await updateProduct(product._id, data);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(data);
        toast.success("Product uploaded successfully!");
      }

      onClose();
    } catch (error) {
      console.error("❌ Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-[500px] max-h-screen overflow-auto rounded-2xl shadow-2xl p-[2px]"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-semibold text-center mb-4 border-b border-gray-700 pb-2">
              {isEdit ? "Edit Product" : "Upload a Product"}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
              />

              {/* Negotiable */}
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

              {/* Images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Images (max 3)
                </label>

                {formData.images.length < 3 && (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleMultipleImageChange(e.target.files)
                    }
                    className="block w-full text-sm text-gray-400
                      file:mr-3 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-600 file:text-white
                      hover:file:bg-purple-500 cursor-pointer
                      border border-gray-600 rounded-lg p-2"
                  />
                )}

                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
                      >
                        <img
                          src={img instanceof File ? URL.createObjectURL(img) : img}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 text-red-400 hover:text-red-300 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors 
                    ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}
                >
                  {loading ? <Loader className="animate-spin mx-auto" size={20} /> : isEdit ? "Update" : "Upload"}
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
