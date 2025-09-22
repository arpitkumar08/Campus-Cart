import React from 'react';

const PriceRange = ({ priceRange, minInput, maxInput, onMinChange, onMaxChange }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Price Range</h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={(e) => onMinChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => onMaxChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Price Range Slider Visual */}
        <div className="relative">
          <div className="h-2 bg-gray-600 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
              style={{
                marginLeft: `${(priceRange[0] / 500) * 100}%`,
                width: `${((priceRange[1] - priceRange[0]) / 500) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$500+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;