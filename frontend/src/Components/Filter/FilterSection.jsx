import React, { useState } from 'react';
import { Filter as FilterIcon, X, ChevronUp, ChevronDown } from 'lucide-react';
import { categories, conditions, locations, sortOptions } from './FilterData';
import useFilterStore from '../store/filterStore';

// Filter Section Component
function FilterSection({ title, isOpen, onToggle, options, selected, onChange }) {
  return (
    <div className="space-y-3">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-left group">
        <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">{title}</h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
        )}
      </button>
      <div className={`space-y-2 transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {options.map((opt) => (
          <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => onChange(opt, e.target.checked)}
              className="w-4 h-4 rounded border-gray-400/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Price Range Component
const PriceRange = ({ priceRange, onPriceRangeChange }) => {
  const [minInput, setMinInput] = useState(priceRange[0]);
  const [maxInput, setMaxInput] = useState(priceRange[1]);

  React.useEffect(() => {
    setMinInput(priceRange[0]);
    setMaxInput(priceRange[1]);
  }, [priceRange]);

  const handleMinChange = (value) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    setMinInput(value);
    if (numValue <= priceRange[1]) {
      onPriceRangeChange([numValue, priceRange[1]]);
    }
  };

  const handleMaxChange = (value) => {
    const numValue = value === '' ? 500 : parseInt(value) || 500;
    setMaxInput(value);
    if (numValue >= priceRange[0]) {
      onPriceRangeChange([priceRange[0], numValue]);
    }
  };

  return (
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

        {/* Price Range Visual */}
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
            <span>₹0</span>
            <span>₹500+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get filter state and actions from global store
  const {
    selectedCategories,
    selectedConditions,
    selectedLocations,
    priceRange,
    sortBy,
    setSelectedCategories,
    setSelectedConditions,
    setSelectedLocations,
    setPriceRange,
    setSortBy,
    clearFilters,
    hasActiveFilters
  } = useFilterStore();

  // Filter section toggles
  const [openSections, setOpenSections] = useState({
    categories: true,
    conditions: false,
    locations: false
  });

  // Toggle functions
  const toggleValue = (arr, value, setArr) => {
    if (arr.includes(value)) {
      setArr(arr.filter(v => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (value, checked, selectedArray, setSelectedArray) => {
    if (checked) {
      setSelectedArray([...selectedArray, value]);
    } else {
      setSelectedArray(selectedArray.filter(item => item !== value));
    }
  };

  // Apply filters and close panel
  const handleApply = () => {
    setIsOpen(false);
  };

  // Clear filters
  const handleClear = () => {
    clearFilters();
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative group h-8 px-3 text-white/80 hover:text-purple-400 hover:bg-white/10 border border-gray-400/20 rounded-lg flex items-center space-x-1 transition-all ${
          hasActiveFilters() ? 'bg-purple-500/20 border-purple-400/40' : ''
        }`}
      >
        <FilterIcon className="h-4 w-4" />
        <span className="text-xs">Filters</span>
        {hasActiveFilters() && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-purple-500 rounded-full"></span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed top-0 left-0 w-80 h-screen bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/30 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto h-[calc(100%-120px)] space-y-6">

          {/* Categories */}
          <FilterSection
            title="Categories"
            isOpen={openSections.categories}
            onToggle={() => toggleSection('categories')}
            options={categories}
            selected={selectedCategories}
            onChange={(value, checked) => handleCheckboxChange(value, checked, selectedCategories, setSelectedCategories)}
          />

          {/* Condition */}
          <FilterSection
            title="Condition"
            isOpen={openSections.conditions}
            onToggle={() => toggleSection('conditions')}
            options={conditions}
            selected={selectedConditions}
            onChange={(value, checked) => handleCheckboxChange(value, checked, selectedConditions, setSelectedConditions)}
          />

          {/* Location */}
          <FilterSection
            title="Location"
            isOpen={openSections.locations}
            onToggle={() => toggleSection('locations')}
            options={locations}
            selected={selectedLocations}
            onChange={(value, checked) => handleCheckboxChange(value, checked, selectedLocations, setSelectedLocations)}
          />

          {/* Price Range */}
          <PriceRange
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          {/* Sort By */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Sort By</h4>
            <select
              className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/30 flex space-x-2">
          <button
            onClick={handleClear}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSection;