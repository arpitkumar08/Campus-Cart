import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 h-5 w-5" />
      <input
        type="text"
        placeholder="Search products, categories, or locations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 py-2 pr-4 w-full rounded-lg bg-white/10 backdrop-blur-md border border-gray-400/20 placeholder-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all"
      />
    </div>
  );
};

export default SearchBar;
