import React, { useEffect, useMemo, useState } from "react"; // 1. REMOVED useRef
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
// import { MoreVertical } from "lucide-react"; // 2. REMOVED
import ReportProductModal from "../Modals/ReportProductModal";
import useProductStore from "../../store/useProductStore";
import useSearchStore from "../../store/useSearchStore";
import useFilterStore from "../../store/useFilterStore";
import HeartIcon from "../Icons/HeartIcon";

const Products = () => {
  const { products, fetchProducts, isLoading, fetchFavorites } = useProductStore();
  const { query } = useSearchStore();
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
    hasActiveFilters,
  } = useFilterStore();

  const navigate = useNavigate();

  // 3. REMOVED menuOpenIndex and menuRefs
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  // 4. REMOVED handleClickOutside useEffect

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    // TODO: Implement filtering logic based on query, selectedCategories, etc.
    return filtered;
  }, [products, query, selectedCategories, selectedConditions, selectedLocations, priceRange, sortBy]);

  // 5. ADDED handler to pass to card
  const handleReportClick = (productId) => {
    console.log("Report click handled in Products.js, productId:", productId);
    setSelectedProductId(productId);
    setReportModalOpen(true);
  };

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
                <div key={product._id} className="group w-full">
                  <TiltedCard
                    productId={product._id} // 6. PASS productId
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
                    onReportClick={handleReportClick} // 7. PASS handler
                    overlayContent={
                      <>
                        <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 flex items-center gap-1">
                          {product.category}
                        </div>
                        <div className="absolute top-2 right-2 z-20">
                          <HeartIcon product={product} />
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
                  
                  {/* 8. REMOVED the entire menu div from here */}
                  
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
            setSelectedProductId(null); // Clear selected ID
          }}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;