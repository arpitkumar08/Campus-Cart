import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductUploadModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        isNegotiable: false,
        condition: "New",
        location: "",
        images: [], // will store the selected files
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
        "Other"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleMultipleImageChange = (files) => {
        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            setFormData(prev => {
                // Combine existing images with new ones, limit to 3 total
                const combinedFiles = [...prev.images, ...newFiles].slice(0, 3);
                return {
                    ...prev,
                    images: combinedFiles
                };
            });
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if at least 3 images are selected
        if (formData.images.length < 3) {
            alert("Please select at least 3 images");
            return;
        }

        

        onClose();
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
                    className="w-full max-w-[500px] max-h-screen overflow-hidden rounded-2xl shadow-2xl p-[2px]"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full">
                        <h1 className="text-2xl font-semibold text-center mb-4 border-b border-gray-700 pb-2">
                            📦 Upload a Product
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                            <input
                                type="text"
                                name="title"
                                placeholder="Product Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
                            />

                            {/* <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                            /> */}

                            {/* Category Dropdown */}
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

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

                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location (e.g., College name if student)"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-purple-500"
                                />
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <i className="ri-information-line"></i>
                                    If college student, write your college name
                                </p>
                            </div>

                            {/* Negotiable */}
                            <label className="custom-checkbox-label">
                                <div className="custom-checkbox flex">
                                    <input
                                        type="checkbox"
                                        name="isNegotiable"
                                        checked={formData.isNegotiable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-purple-600 rounded border-gray-400"
                                    />
                                    <span></span>
                                </div>
                                Price Negotiable
                            </label>

                            {/* Single Image Upload for Multiple Images */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Upload Images (minimum 3 required)
                                </label>

                                {formData.images.length < 3 && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleMultipleImageChange(e.target.files)}
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
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">
                                            ✓ {formData.images.length} image(s) selected {formData.images.length >= 3 ? "(Complete!)" : `(${3 - formData.images.length} more needed)`}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.images.map((file, index) => (
                                                <div key={index} className="bg-gray-800 px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="text-red-400 hover:text-red-300 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.images.length < 3 && (
                                    <p className="text-xs text-gray-500">
                                        Tip: You can select multiple images at once by holding Ctrl/Cmd while clicking files
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
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