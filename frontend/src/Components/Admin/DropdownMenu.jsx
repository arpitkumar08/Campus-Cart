import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, Ban, Trash2 } from "lucide-react";

const DropdownMenu = ({ isOpen, onClose, type }) => {
  const menuRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Suspend User Button - common for both */}
          <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-yellow-400">
            <UserX size={16} className="mr-2" /> Suspend User
          </button>

          {/* Ban Button - common for both */}
          <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-red-500">
            <Ban size={16} className="mr-2" /> Ban {type === "product" ? "Product" : "User"}
          </button>

          {/* Delete Product - only for products */}
          {type === "product" && (
            <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-gray-400">
              <Trash2 size={16} className="mr-2" /> Delete Product
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownMenu;
