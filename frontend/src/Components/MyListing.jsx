import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TiltedCard from "./Home/TitleCard";
import ProductUploadModal from "./ProductUploadModal";
import useProductStore from "../store/useProductStore";
import useAuthStore from "../store/useAuthStore";
import EditIcon from "../Components/Icons/EditIcon"; // ✅ Import EditIcon component

const MyListings = () => {
  const navigate = useNavigate();
  const { myProducts, fetchMyListedProducts, isLoading } = useProductStore();
  const { user, isCheckingAuth } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  function getCategoryEmoji(category) {
    switch (category?.toLowerCase()) {
      case "electronics": return "💻";
      case "books": return "📚";
      case "clothing": return "👕";
      case "furniture": return "🛋️";
      case "sports": return "🏀";
      case "transportation": return "🏍️";
      default: return "🛍️";
    }
  }

  useEffect(() => {
    if (user && user._id) {
      fetchMyListedProducts(user._id);
    }
  }, [user, fetchMyListedProducts]);

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-lg">
        Loading your listings...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-lg">
        Please log in to see your listings.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-white hover:text-blue-400"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {myProducts && myProducts.length > 0 ? (
          myProducts.map((product) => (
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
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 z-20">
                    {getCategoryEmoji(product.category)} {product.category}
                  </div>

                  {/* ✅ Edit Button using EditIcon */}
                  <EditIcon
                    size={20}
                    className="absolute top-1 left-45 z-20"
                    onClick={() => {
                      setEditProduct(product);
                      setShowModal(true);
                    }}
                  />

                  {/* Bottom Details */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                    <span className="text-sm font-bold truncate">{product.title}</span>
                    <span className="text-sm font-semibold text-green-400">₹{product.price}</span>
                    <span className="text-xs text-gray-400 truncate">{product.location}</span>
                  </div>
                </>
              }
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full mt-10">
            You haven’t listed any products yet.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <ProductUploadModal
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          product={editProduct}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default MyListings;
