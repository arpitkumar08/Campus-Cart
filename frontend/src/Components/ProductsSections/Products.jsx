import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import ReportProductModal from "../Modals/ReportProductModal";
import useProductStore from "../../store/useProductStore";
import useSearchStore from "../../store/useSearchStore";
import useFilterStore from "../../store/useFilterStore";
import HeartIcon from "../Icons/HeartIcon";

const Products = () => {
  const { products, fetchProducts, isLoading, fetchFavorites } =
    useProductStore();
  const { query } = useSearchStore();
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
    hasActiveFilters, // You can use this to show a "Clear Filters" button
  } = useFilterStore();

  const navigate = useNavigate();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [fetchProducts, fetchFavorites]); // <-- Added dependencies

  // --- FIX: This section is now populated with filtering logic ---
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Apply Search Query
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery) ||
          (product.location &&
            product.location.toLowerCase().includes(searchQuery))
      );
    }

    // 2. Apply Category Filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // 3. Apply Condition Filters
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((product) =>
        selectedConditions.includes(product.condition)
      );
    }

    // 4. Apply Location Filters
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((product) =>
        selectedLocations.includes(product.location)
      );
    }

    // 5. Apply Price Range Filter (Assuming priceRange is [min, max])
    if (priceRange && priceRange[1] > priceRange[0]) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // 6. Apply Sorting
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "date_new") {
      // Assuming products have a 'createdAt' field
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

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
  // --- END OF FIX ---

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
                    onReportClick={handleReportClick}
                    overlayContent={
                      <>
                        <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 flex items-center gap-1">
                          {product.category}
                        </div>
                        <div className="absolute top-2 right-2 z-20">
                          <HeartIcon product={product} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-10">
                          <span className="text-sm font-bold truncate">
                            📌 {product.title}
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            💰 ₹{product.price}
                          </span>
                          <div className="flex flex-col items-start gap-2 justify-between text-xs text-gray-400">
                            <span className="truncate">
                              📍 {product.location}
                            </span>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl font-semibold mb-2">
                No products found
              </div>
              <p>
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
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
            setSelectedProductId(null);
          }}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;