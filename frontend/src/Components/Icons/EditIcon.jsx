import React from "react";
import { Pencil } from "lucide-react";

const EditIcon = ({
  size = 20,
  className = "",
  onClick = () => {},
  showAnimation = true,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`relative p-2 rounded-full transition-all duration-200 ease-in-out
        hover:scale-110 hover:bg-white/20 active:scale-95
        ${showAnimation ? "transform" : ""} ${className}`}
      title="Edit this item"
    >
      <div className="absolute inset-0 rounded-full bg-black/40 z-0"></div>
      <Pencil
        size={size}
        stroke="white"
        fill="none"
        strokeWidth={2}
        className="relative z-10 transition-all duration-200 ease-in-out hover:stroke-blue-400"
      />
    </button>
  );
};

export default EditIcon;
