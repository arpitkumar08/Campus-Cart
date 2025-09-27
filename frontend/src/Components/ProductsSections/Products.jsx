import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import HeartIcon from "../Icons/HeartIcon";
import useProductStore from "../../store/productStore";
import useSearchStore from "../../store/searchStore"; // ✅ Import global query

const Products = () => {
  const { products, fetchProducts, isLoading, fetchFavorites } = useProductStore();
  const { query } = useSearchStore(); // ✅ Read global query
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white text-lg">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-950 to-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 justify-items-center">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/details/${product._id}`)}
            className="cursor-pointer"
          >
            <TiltedCard
              imageSrc={product.images?.[0] || "/images/default.png"}
              altText={product.title}
              captionText={product.title}
              containerHeight="300px"
              containerWidth="220px"
              imageHeight="290px"
              imageWidth="220px"
              rotateAmplitude={10}
              scaleOnHover={1.05}
              displayOverlayContent={true}
              overlayContent={
                <>
                  <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 flex items-center gap-1">
                    {product.category}
                  </div>
                  <div className="absolute top-2 right-2 z-20">
                    <HeartIcon product={product} size={20} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                    <span className="text-sm font-bold truncate">📌 {product.title}</span>
                    <span className="text-sm font-semibold text-green-400">💰 ₹{product.price}</span>
                    <span className="text-xs text-gray-400 truncate">📍 {product.location}</span>
                  </div>
                </>
              }
            />
          </div>
        ))
      ) : (
        <p className="text-white text-center col-span-full mt-10">No products found.</p>
      )}
    </div>
  );
};

export default Products;
