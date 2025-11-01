import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import ReportProductModal from "../Modals/ReportProductModal";
import useProductStore from "../../store/useProductStore";
import useSearchStore from "../../store/useSearchStore";
import useFilterStore from "../../store/useFilterStore";
import HeartIcon from "../Icons/HeartIcon";

const Products = () => {
  const { products, fetchProducts, isLoading, fetchFavorites, error } =
    useProductStore();
  const { query } = useSearchStore();
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
  } = useFilterStore();

  const navigate = useNavigate();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    console.log("📦 useEffect triggered — fetching products and favorites...");
    fetchProducts()
      .then(() => console.log("✅ Products fetched successfully"))
      .catch((err) => console.error("❌ Error fetching products:", err));

    fetchFavorites()
      .then(() => console.log("✅ Favorites fetched successfully"))
      .catch((err) => console.error("❌ Error fetching favorites:", err));
  }, []);

  // Log store data every render for visibility
  console.log("🛒 Store Data Snapshot:", {
    isLoading,
    error,
    totalProducts: products?.length,
    productsSample: products?.slice(0, 2),
  });

  const filteredProducts = useMemo(() => {
    console.log("🔍 Filtering products...");
    let filtered = [...products];

    if (!Array.isArray(products)) {
      console.error("🚨 products is not an array:", products);
      return [];
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      console.log("🔎 Search query:", searchQuery);
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.location?.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedCategories.length > 0) {
      console.log("🧩 Filtering by categories:", selectedCategories);
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    if (selectedConditions.length > 0) {
      console.log("⚙️ Filtering by conditions:", selectedConditions);
      filtered = filtered.filter((p) =>
        selectedConditions.includes(p.condition)
      );
    }

    if (selectedLocations.length > 0) {
      console.log("📍 Filtering by locations:", selectedLocations);
      filtered = filtered.filter((p) =>
        selectedLocations.includes(p.location)
      );
    }

    if (priceRange && priceRange[1] > priceRange[0]) {
      console.log("💰 Filtering by price range:", priceRange);
      filtered = filtered.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
    }

    if (sortBy) {
      console.log("↕️ Sorting by:", sortBy);
      if (sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
      else if (sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
      else if (sortBy === "date_new")
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    console.log("✅ Filtered products count:", filtered.length);
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

  const handleReportClick = (productId) => {
    console.log("🚨 Report clicked for product:", productId);
    setSelectedProductId(productId);
    setReportModalOpen(true);
  };

  if (isLoading) {
    console.log("⏳ Loading products...");
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white text-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("🚨 Product fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-gray-400 mb-4 text-sm">
                Showing {filteredProducts.length} products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                
                {filteredProducts.map((product, idx) => (
                  
                  <TiltedCard
                    key={product._id || idx}
                    productId={product._id}
                    imageSrc={product.images?.[0] || "/images/default.png"}
                    altText={product.title}
                    containerHeight="300px"
                    containerWidth="230px"
                    imageHeight="280px"
                    imageWidth="230px"
                    rotateAmplitude={10}
                    scaleOnHover={1.05}
                    displayOverlayContent={true}
                    isSold={product.status === "sold"}
                    onClick={() => {
                      console.log("🖱️ Card clicked for product:", product._id);
                      navigate(`/details/${product._id}`);
                    }}
                    onReportClick={handleReportClick}
                    overlayContent={
                      <>
                        <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md z-20">
                          {product.category}
                        </div>
                        <div className="absolute top-2 right-2 z-20">
                          <HeartIcon product={product} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 text-white px-3 py-2 rounded-b-lg flex flex-col gap-1 z-20">
                          <span className="text-sm font-bold truncate">
                            📌 {product.title}
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            💰 ₹{product.price}
                          </span>
                          <div className="flex flex-col items-start gap-2 text-xs text-gray-400">
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
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl font-semibold mb-2">No products found</div>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {reportModalOpen && (
        <ReportProductModal
          isOpen={reportModalOpen}
          onClose={() => {
            console.log("❌ Closing report modal");
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
