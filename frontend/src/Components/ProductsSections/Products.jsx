import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import ReportProductModal from "../Modals/ReportProductModal";
import HeartIcon from "../Icons/HeartIcon";
import useProductStore from "../../store/useProductStore";
import useSearchStore from "../../store/useSearchStore";
import useFilterStore from "../../store/useFilterStore";

const Products = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, isLoading, fetchFavorites } = useProductStore();
  const { query } = useSearchStore();
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
  } = useFilterStore();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // ✅ Fetch products & favorites on mount
  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [fetchProducts, fetchFavorites]);

  // ✅ Filtering and sorting logic (memoized)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery) ||
          p.location?.toLowerCase().includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategories.length)
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));

    // Condition filter
    if (selectedConditions.length)
      filtered = filtered.filter((p) => selectedConditions.includes(p.condition));

    // Location filter
    if (selectedLocations.length)
      filtered = filtered.filter((p) => selectedLocations.includes(p.location));

    // Price range filter
    if (priceRange?.[1] > priceRange?.[0])
      filtered = filtered.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );

    // Sorting logic
    const sortFunctions = {
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      date_new: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };
    if (sortFunctions[sortBy]) filtered.sort(sortFunctions[sortBy]);

    return filtered;
  }, [
    products,
    query,
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
  ]);

  // ✅ Handle report modal
  const handleReportClick = (productId) => {
    setSelectedProductId(productId);
    setReportModalOpen(true);
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-lg space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <div className="p-6 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group w-full">
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
                  displayOverlayContent
                  isSold={product.status === "sold"}
                  onClick={() => navigate(`/details/${product._id}`)}
                  onReportClick={handleReportClick}
                  overlayContent={
                    <>
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 pointer-events-none">
                        {product.category}
                      </div>

                      {/* Favorite (Heart) Icon */}
                      <div
                        data-ignore-card-click
                        className="absolute top-2 right-2 pointer-events-auto z-30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HeartIcon product={product} />
                      </div>

                      {/* Product Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/50 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10 pointer-events-none">
                        <span className="text-sm font-bold truncate">
                          📌 {product.title}
                        </span>
                        <span className="text-sm font-semibold text-green-400">
                          💰 ₹{product.price}
                        </span>
                        <div className="flex flex-col gap-1 text-xs text-gray-400">
                          <span className="truncate">📍 {product.location}</span>
                          {product.condition && (
                            <span className="bg-gray-700/50 px-1 py-0.5 rounded text-xs">
                              {product.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-3">🔍</div>
            <div className="text-xl font-semibold mb-2">No products found</div>
            <p>Try adjusting your search or filters to find what you’re looking for.</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportProductModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedProductId(null);
          }}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;
