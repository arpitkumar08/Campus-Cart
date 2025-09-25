import React from 'react';
import { Heart } from 'lucide-react';
import useProductStore from '../../store/productStore';

const HeartIcon = ({ product, size = 20, className = "", showAnimation = true }) => {
  const { toggleFavorite, isFavorite } = useProductStore();
  const isLiked = isFavorite(product._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product._id);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-full transition-all duration-200 ease-in-out
        hover:scale-110 hover:bg-white/20 active:scale-95
        ${showAnimation ? 'transform' : ''}
        ${className}
      `}
      title={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <div className="absolute inset-0 rounded-full bg-black/40 z-0"></div>

      <Heart
        size={size}
        className={`relative z-10 transition-all duration-200 ease-in-out
          ${isLiked 
            ? 'fill-red-500 stroke-red-500 scale-110' 
            : 'fill-none stroke-white hover:stroke-red-400'
          }
          ${showAnimation && isLiked ? 'animate-pulse' : ''}
        `}
      />

      {showAnimation && isLiked && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping z-0"></div>
      )}
    </button>
  );
};

export default HeartIcon;
