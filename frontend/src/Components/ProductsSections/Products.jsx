import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useProductStore from "../../store/productStore";

const Products = () => {
  const { products, fetchProducts, isLoading } = useProductStore();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6">
      {/* Product Grid */}
      <div
        className="grid gap-8 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 
          max-w-7xl mx-auto"
      >
        <AnimatePresence>
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl 
                  border border-gray-700 hover:border-blue-500 
                  shadow-md hover:shadow-2xl 
                  transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={product.images?.[0] || "/images/default.png"} // show first image or fallback
                    alt={product.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500"
                  />

                  {/* Category Badge on top-left */}
                  <span className="absolute top-2 left-2 px-3 py-1 text-xs 
                    bg-blue-400 text-white rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                    {product.title}
                  </h2>

                  <p className="text-blue-400 font-bold">₹{product.price}</p>

                  {/* Location */}
                  <p className="text-gray-400 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zM10 10a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    {product.location}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-white text-center col-span-full">
              No products found.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
