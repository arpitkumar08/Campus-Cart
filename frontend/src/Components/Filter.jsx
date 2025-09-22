import React, { useState } from 'react';
import { Filter as FilterIcon, X, ChevronDown, ChevronUp } from 'lucide-react';

const Filter = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // ✅ Raw string states for inputs (fixes 01 issue)
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("500");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [openSections, setOpenSections] = useState({
    categories: true,
    condition: true,
    location: true,
    sort: true
  });

  const categories = [
    'Electronics', 'Books & Study Materials', 'Clothing', 'Furniture',
    'Sports & Fitness', 'Kitchen & Dining', 'Musical Instruments',
    'Room Decor', 'Transportation', 'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const locations = [
    'Main Campus', 'North Campus', 'South Campus',
    'East Campus', 'West Campus', 'Off-Campus'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const updateFilters = (newRange = priceRange, newSort = sortBy) => {
    onFiltersChange?.({
      categories: selectedCategories,
      conditions: selectedConditions,
      locations: selectedLocations,
      priceRange: newRange,
      sortBy: newSort
    });
  };

  const handleCategoryChange = (category, checked) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(updated);
    updateFilters();
  };

  const handleConditionChange = (condition, checked) => {
    const updated = checked
      ? [...selectedConditions, condition]
      : selectedConditions.filter(c => c !== condition);
    setSelectedConditions(updated);
    updateFilters();
  };

  const handleLocationChange = (location, checked) => {
    const updated = checked
      ? [...selectedLocations, location]
      : selectedLocations.filter(l => l !== location);
    setSelectedLocations(updated);
    updateFilters();
  };

  // ✅ Inputs update logic
  const handleMinChange = (val) => {
    setMinInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num <= priceRange[1]) {
      setPriceRange([num, priceRange[1]]);
      updateFilters([num, priceRange[1]]);
    }
  };

  const handleMaxChange = (val) => {
    setMaxInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= priceRange[0]) {
      setPriceRange([priceRange[0], num]);
      updateFilters([priceRange[0], num]);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateFilters(priceRange, newSort);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedLocations([]);
    setPriceRange([0, 500]);
    setMinInput("0");
    setMaxInput("500");
    setSortBy('newest');
    onFiltersChange?.({
      categories: [],
      conditions: [],
      locations: [],
      priceRange: [0, 500],
      sortBy: 'newest'
    });
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFilterCount = () => {
    return (
      selectedCategories.length +
      selectedConditions.length +
      selectedLocations.length
    );
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group h-8 px-3 text-white/80 hover:text-purple-400 hover:bg-white/10 transition-all border border-gray-400/20 rounded-lg bg-transparent flex items-center space-x-1"
      >
        <FilterIcon className="h-4 w-4" />
        <span className="text-xs">Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 h-screen backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 w-96 h-screen bg-zinc-900 border-r border-gray-700/30 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Price Range</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minInput}
                    onChange={(e) => handleMinChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxInput}
                    onChange={(e) => handleMaxChange(e.target.value)}
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

            {/* Categories */}
            <FilterSection
              title="Categories"
              isOpen={openSections.categories}
              onToggle={() => toggleSection('categories')}
              options={categories}
              selected={selectedCategories}
              onChange={handleCategoryChange}
            />

            {/* Condition */}
            <FilterSection
              title="Condition"
              isOpen={openSections.condition}
              onToggle={() => toggleSection('condition')}
              options={conditions}
              selected={selectedConditions}
              onChange={handleConditionChange}
            />

            {/* Location */}
            <FilterSection
              title="Location"
              isOpen={openSections.location}
              onToggle={() => toggleSection('location')}
              options={locations}
              selected={selectedLocations}
              onChange={handleLocationChange}
            />

            {/* Sort By */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('sort')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-white">Sort By</h4>
                {openSections.sort ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <div
                className={`space-y-2 transition-all duration-200 ${openSections.sort ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
              >
                {sortOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-4 h-4 text-purple-500 border-gray-400/20 bg-white/10 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/30">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ Small helper component for repeated sections
function FilterSection({ title, isOpen, onToggle, options, selected, onChange }) {
  return (
    <div className="space-y-3">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-left">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      <div
        className={`space-y-2 transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        {options.map((opt) => (
          <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => onChange(opt, e.target.checked)}
              className="w-4 h-4 rounded border-gray-400/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Filter;
