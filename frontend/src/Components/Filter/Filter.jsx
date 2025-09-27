import React, { useState } from 'react';
import { Filter as FilterIcon, X, ChevronUp, ChevronDown } from 'lucide-react';
import { categories, conditions, locations, sortOptions } from './FilterData';
import useFilterStore from '../../store/filterStore';

// Filter Section Component
function FilterSection({ title, isOpen, onToggle, options, selected, onChange }) {
  return (
    <div className="space-y-3">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-left group">
        <h4 className="text-sm font-medium text-white group-hover:text-purple-400">{title}</h4>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400"/> : <ChevronDown className="h-4 w-4 text-gray-400"/>}
      </button>
      <div className={`space-y-2 transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {options.map(opt => (
          <label key={opt} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => onChange(opt, e.target.checked)}
              className="w-4 h-4 rounded border-gray-400/20 bg-white/10 text-purple-500"
            />
            <span className="text-sm text-gray-300">{opt}</span>
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
    const numValue = Number(value) || 0;
    setMinInput(value);
    if (numValue <= priceRange[1]) onPriceRangeChange([numValue, priceRange[1]]);
  };
  const handleMaxChange = (value) => {
    const numValue = Number(value) || 500;
    setMaxInput(value);
    if (numValue >= priceRange[0]) onPriceRangeChange([priceRange[0], numValue]);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Price Range</h4>
      <div className="flex items-center space-x-2">
        <input type="number" value={minInput} onChange={e => handleMinChange(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 text-white"/>
        <span className="text-gray-400">-</span>
        <input type="number" value={maxInput} onChange={e => handleMaxChange(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 text-white"/>
      </div>
    </div>
  );
};

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedCategories, selectedConditions, selectedLocations, priceRange, sortBy,
    setSelectedCategories, setSelectedConditions, setSelectedLocations, setPriceRange, setSortBy,
    clearFilters, hasActiveFilters
  } = useFilterStore();

  const [openSections, setOpenSections] = useState({categories:true,conditions:false,locations:false});

  const toggleSection = (section) => setOpenSections(prev => ({...prev, [section]: !prev[section]}));

  const handleCheckboxChange = (value, checked, selectedArray, setSelectedArray) => {
    if (checked) setSelectedArray([...selectedArray, value]);
    else setSelectedArray(selectedArray.filter(item => item !== value));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`relative group h-8 px-3 text-white/80 hover:text-purple-400 hover:bg-white/10 border border-gray-400/20 rounded-lg flex items-center space-x-1 ${hasActiveFilters() ? 'bg-purple-500/20 border-purple-400/40' : ''}`}
      >
        <FilterIcon className="h-4 w-4"/>
        <span className="text-xs">Filters</span>
        {hasActiveFilters() && <span className="absolute -top-1 -right-1 h-3 w-3 bg-purple-500 rounded-full"></span>}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      <div className={`fixed top-0 left-0 w-80 h-screen bg-gray-900/95 border-r border-gray-700/30 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded text-white/80"><X className="h-5 w-5"/></button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-120px)] space-y-6">
          <FilterSection title="Categories" isOpen={openSections.categories} onToggle={() => toggleSection('categories')} options={categories} selected={selectedCategories} onChange={(v,c)=>handleCheckboxChange(v,c,selectedCategories,setSelectedCategories)}/>
          <FilterSection title="Condition" isOpen={openSections.conditions} onToggle={() => toggleSection('conditions')} options={conditions} selected={selectedConditions} onChange={(v,c)=>handleCheckboxChange(v,c,selectedConditions,setSelectedConditions)}/>
          <FilterSection title="Location" isOpen={openSections.locations} onToggle={() => toggleSection('locations')} options={locations} selected={selectedLocations} onChange={(v,c)=>handleCheckboxChange(v,c,selectedLocations,setSelectedLocations)}/>
          <PriceRange priceRange={priceRange} onPriceRangeChange={setPriceRange}/>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Sort By</h4>
            <select className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              {sortOptions.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700/30 flex space-x-2">
          <button onClick={clearFilters} className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Clear All</button>
          <button onClick={()=>setIsOpen(false)} className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">Apply</button>
        </div>
      </div>
    </>
  );
};

export default Filter;
