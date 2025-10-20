import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical } from "lucide-react";
import TiltedCard from "./Home/TitleCard";
import ProductUploadModal from "./Modals/ProductUploadModal";
import DeleteModal from "./Modals/DeleteModal";
import useProductStore from "../store/useProductStore";
import useAuthStore from "../store/useAuthStore";
import EditIcon from "../Components/Icons/EditIcon";
import axios from "axios";

const MyListings = () => {
  const navigate = useNavigate();
  const { myProducts, fetchMyListedProducts, deleteProduct, markAsSold, isLoading } =
    useProductStore();
  const { user, isCheckingAuth } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const menuRefs = useRef([]);

  function getCategoryEmoji(category) {
    switch (category?.toLowerCase()) {
      case "electronics":
        return "💻";
      case "books":
        return "📚";
      case "clothing":
        return "👕";
      case "furniture":
        return "🛋️";
      case "sports":
        return "🏀";
      case "transportation":
        return "🏍️";
      default:
        return "🛍️";
    }
  }

  const handleMarkSold = async () => {
      try {
        await axios.post(
          `http://localhost:5000/api/${product._id}/markAsSold`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
  
        alert("✅ Product marked as sold!");
        setProduct({ ...product, isSold: true }); // Update UI instantly
      } catch (error) {
        console.error("❌ Error marking as sold:", error);
        alert("Failed to mark product as sold.");
      }
    };
  useEffect(() => {
    if (user && user._id) {
      fetchMyListedProducts(user._id);
    }
  }, [user, fetchMyListedProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRefs.current[menuOpenIndex] &&
        !menuRefs.current[menuOpenIndex].contains(e.target)
      ) {
        setMenuOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenIndex]);

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
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-white hover:text-blue-400"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {myProducts && myProducts.length > 0 ? (
          myProducts.map((product, index) => (
            <div
              key={product._id}
              className={`relative group ${product.status === "sold" ? "opacity-60 grayscale" : ""}`}
            >
              <TiltedCard
                productId={product._id}
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
                isSold={product.status === "sold"}
                overlayContent={
                  <>
                    <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 z-20">
                      {getCategoryEmoji(product.category)} {product.category}
                    </div>

                    {product.status === "sold" && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-red-500 text-lg font-bold rounded-lg z-30">
                        SOLD
                      </div>
                    )}

                    {product.status !== "sold" && (
                      <EditIcon
                        size={20}
                        className="absolute top-2 right-10 z-20 cursor-pointer"
                        onClick={() => {
                          setEditProduct(product);
                          setShowModal(true);
                        }}
                      />
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                      <span className="text-sm font-bold truncate">{product.title}</span>
                      <span className="text-sm font-semibold text-green-400">₹{product.price}</span>
                      <span className="text-xs text-gray-400 truncate">{product.location}</span>
                    </div>
                  </>
                }
              />

              {/* Three Dots Menu */}
              <div
                className="absolute bottom-2 right-2 z-30 bg-slate-800 backdrop-blur-sm rounded-full p-1 cursor-pointer"
                ref={(el) => (menuRefs.current[index] = el)}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenIndex(menuOpenIndex === index ? null : index);
                }}
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </div>

              {menuOpenIndex === index && (
                <div
                  className="absolute bottom-10 right-2 z-40 bg-slate-900 shadow-lg rounded-md p-2 w-40 border border-gray-700"
                  onClick={(e) => e.stopPropagation()} // prevent closing menu
                  ref={(el) => (menuRefs.current[index] = el)} // make sure menuRef exists
                >
                  {product.status !== "sold" ? (
                    <>
                      <button
                        className="w-full text-left hover:text-yellow-400 text-gray-200 px-2 py-1 rounded-md"
                        onClick={(e) => {
                          {handleMarkSold}
                          e.stopPropagation();
                          console.log("Mark as Sold clicked:", product._id);
                          markAsSold(product._id);
                          setMenuOpenIndex(null);
                        }}
                      >
                        Mark as Sold
                      </button>
                      <button
                        className="w-full text-left hover:text-red-600 text-gray-200 px-2 py-1 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete Product clicked:", product._id);
                          setSelectedProduct(product);
                          setDeleteModalOpen(true);
                          setMenuOpenIndex(null);
                        }}
                      >
                        Delete Product
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm text-center">Already Sold</p>
                  )}
                </div>
              )}

            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full mt-10">
            You haven’t listed any products yet.
          </p>
        )}
      </div>

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

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        productName={selectedProduct?.title}
        onConfirm={() => {
          deleteProduct(selectedProduct._id);
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyListings;
