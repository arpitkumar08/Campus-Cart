import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductUploadModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    location: "",
    description: "",
    images: ["", "", ""], // at least 3 image slots
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (index, file) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = file;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Submitted:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Modal Container */}
        <motion.div
          className="w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-[2px] bg-gradient-to-r from-gray-300/40 to-gray-200/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Inner dark card */}
          <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-semibold text-center mb-4 border-b border-gray-700 pb-2">
              📦 Upload a Product
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Image Uploads */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Images (at least 3)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((img, index) => (
                    <input
                      key={index}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                      required={index < 3} // at least 3 required
                      className="block w-full text-sm text-gray-400
                                 file:mr-3 file:py-2 file:px-4
                                 file:rounded-md file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-purple-600 file:text-white
                                 hover:file:bg-purple-500"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition"
                >
                  Upload
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
