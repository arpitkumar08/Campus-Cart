import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
      <div className={`space-y-2 transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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

export default FilterSection;