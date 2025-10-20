import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import { MoreVertical } from "lucide-react";
import ReportProductModal from "../Modals/ReportProductModal";
import useProductStore from "../../store/useProductStore";
import useSearchStore from "../../store/useSearchStore";
import useFilterStore from "../../store/useFilterStore";

const Products = () => {
  const { products, fetchProducts, isLoading, fetchFavorites } = useProductStore();
  const { query } = useSearchStore();
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
    hasActiveFilters
  } = useFilterStore();

  const navigate = useNavigate();

  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const menuRefs = useRef([]);

  useEffect(() => {
    console.log("Fetching products...");
    fetchProducts();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRefs.current[menuOpenIndex] &&
        !menuRefs.current[menuOpenIndex].contains(e.target)
      ) {
        console.log("Clicked outside menu, closing menu index", menuOpenIndex);
        setMenuOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenIndex]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    // ... same filtering logic
    return filtered;
  }, [products, query, selectedCategories, selectedConditions, selectedLocations, priceRange, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white text-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 justify-items-center">
              {filteredProducts.map((product, index) => (
                <div key={product._id} className="relative group">
                  <TiltedCard
                    productId={product._id}
                    imageSrc={product.images?.[0] || "/images/default.png"}
                    altText={product.title}
                    captionText={product.title}
                    containerHeight="280px"
                    containerWidth="200px"
                    imageHeight="260px"
                    imageWidth="200px"
                    rotateAmplitude={10}
                    scaleOnHover={1.05}
                    displayOverlayContent={true}
                    isSold={product.status === "sold"}
                    onClick={() => navigate(`/details/${product._id}`)}
                    overlayContent={
                      <>
                        <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 flex items-center gap-1">
                          {product.category}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                          <span className="text-sm font-bold truncate">📌 {product.title}</span>
                          <span className="text-sm font-semibold text-green-400">💰 ₹{product.price}</span>
                          <div className="flex flex-col items-start gap-2 justify-between text-xs text-gray-400">
                            <span className="truncate">📍 {product.location}</span>
                            {product.condition && (
                              <span className="ml-2 bg-gray-700/50 px-1 py-0.5 rounded text-xs">
                                {product.condition}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    }
                  />

                  {/* Bottom-right menu */}
                  <div
                    className="absolute bottom-3 right-2 z-30 bg-slate-800 backdrop-blur-sm rounded-full p-1 cursor-pointer"
                    ref={el => menuRefs.current[index] = el}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Menu clicked for product:", product.title);
                      setMenuOpenIndex(menuOpenIndex === index ? null : index);
                      setSelectedProductId(product._id);
                    }}
                  >
                    <MoreVertical className="w-5 h-5 text-white" />
                  </div>

                  {menuOpenIndex === index && (
                    <div
                      className="absolute bottom-10 right-2 z-40 bg-slate-900 shadow-lg rounded-md p-2 w-40 border border-gray-700"
                      ref={el => menuRefs.current[index] = el}
                      onClick={(e) => e.stopPropagation()} // prevent closing the menu
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          console.log("Clicked Report Product button, productId:", product._id);
                          setSelectedProductId(product._id);
                          setReportModalOpen(true);
                        }}
                        className="w-full text-left hover:text-red-600 text-gray-200 px-2 py-1 rounded-md"
                      >
                        Report Product
                      </button>
                    </div>

                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl font-semibold mb-2">No products found</div>
            </div>
          )}
        </div>
      </div>

      {reportModalOpen && (
        <ReportProductModal
          isOpen={reportModalOpen}
          onClose={() => {
            console.log("Closing report modal");
            setReportModalOpen(false);
          }}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;
