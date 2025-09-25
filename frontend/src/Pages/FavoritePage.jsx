import React, { useEffect } from "react";
import TiltedCard from "../Components/Home/TitleCard";
import useProductStore from "../store/productStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FavoritesPage = () => {
  const { favorites, fetchFavorites, isLoading } = useProductStore();
  const navigate = useNavigate();

  // Map categories to emojis
  function getCategoryEmoji(category) {
    switch (category?.toLowerCase()) {
      case "electronics": return "💻";
      case "books": return "📚";
      case "clothes": return "👕";
      case "sports": return "🏀";
      case "furniture": return "🛋️";
      case "transportation": return "🏍️";
      default: return "🛍️";
    }
  }

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white text-lg">
        Loading favorites...
      </div>
    );
  }


  return (
    <div className="relative min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Back Arrow */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-1 px-3 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline text-sm font-medium">Home</span>
      </button>

      <h1 className="text-2xl font-bold mb-4 text-white mt-6">My Favorites</h1>

      {/* Favorites Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {favorites && favorites.length > 0 ? (
          favorites.map((product) => (
            <TiltedCard
              key={product._id}
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
                  {/* Category badge */}
                  <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 z-20">
                    {getCategoryEmoji(product.category)} {product.category}
                  </div>
                  {/* Bottom overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                    <span className="text-sm font-bold truncate">📌 {product.title}</span>
                    <span className="text-sm font-semibold text-green-400">💰 ₹{product.price}</span>
                    <span className="text-xs text-gray-400 truncate">📍 {product.location}</span>
                  </div>
                </>
              }
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full mt-10">
            You haven’t added any favorites yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
