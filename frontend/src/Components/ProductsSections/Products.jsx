import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Home/TitleCard";
import HeartIcon from "../Icons/HeartIcon";
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

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (query && query.trim() !== '') {
      const searchQuery = query.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.location.toLowerCase().includes(searchQuery) ||
        (product.description && product.description.toLowerCase().includes(searchQuery))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(product => selectedConditions.includes(product.condition));
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(product => selectedLocations.includes(product.location));
    }

    // Price filter
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.datePosted) - new Date(a.createdAt || a.datePosted);
        case 'oldest':
          return new Date(a.createdAt || a.datePosted) - new Date(b.createdAt || b.datePosted);
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'name-az':
          return a.title.localeCompare(b.title);
        case 'name-za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

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
      <div className="px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-semibold">
              {query ? `Search results for "${query}"` : 'All Products'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {hasActiveFilters() && ' (filtered)'}
            </p>
          </div>
          {hasActiveFilters() && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-sm">Filters active</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 justify-items-center">
              {filteredProducts.map((product) => (
                <TiltedCard
                  key={product._id}
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
                  onClick={() => navigate(`/details/${product._id}`)}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl font-semibold mb-2">No products found</div>
              <p className="text-sm mb-6">
                {query ? (
                  <>No products match your search for "<strong>{query}</strong>"</>
                ) : hasActiveFilters() ? (
                  'No products match your current filters'
                ) : (
                  'No products available at the moment'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
