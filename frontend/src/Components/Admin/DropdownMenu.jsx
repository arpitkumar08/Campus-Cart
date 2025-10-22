import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, Ban, Trash2 } from "lucide-react";
import axios from "axios"; // Import axios to make API calls

const DropdownMenu = ({
  isOpen,
  onClose,
  type,
  userId, // Changed from onSuspendUser
  productId, // Changed from onDeleteProduct
  onActionComplete, // Add a prop to refetch data in the parent
}) => {
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

  // Handler functions to also close the menu after action
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (type !== "product" || !productId) return;

    try {
      // Use the API route structure you provided
      await axios.delete(
        `http://localhost:5000/api/products/deleteproduct/${productId}`,
        { withCredentials: true }
      );
      // You can add a toast notification here for success
      if (onActionComplete) onActionComplete(); // Tell the parent to refresh
    } catch (err) {
      console.error("Error deleting product:", err);
      // You can add a toast notification here for error
    }
    onClose();
  };

  const handleSuspend = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      // Assuming a similar API structure for suspending a user
      await axios.put(
        `http://localhost:5000/api/admin/suspenduser/${userId}`, // This is an example route
        {},
        { withCredentials: true }
      );
      // You can add a toast notification here for success
      if (onActionComplete) onActionComplete(); // Tell the parent to refresh
    } catch (err) {
      console.error("Error suspending user:", err);
      // You can add a toast notification here for error
    }
    onClose();
  };

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
          <button
            onClick={handleSuspend}
            className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-yellow-400"
          >
            <UserX size={16} className="mr-2" /> Suspend User
          </button>

          {/* Ban Button - common for both */}
          {/* <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-red-500">
            <Ban size={16} className="mr-2" /> Ban {type === "product" ? "Product" : "User"}
          </button> */}

          {/* Delete Product - only for products */}
          {type === "product" && (
            <button
              onClick={(e) => {
                handleDelete(e);
                console.log("Delete button clicked");
              }}
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-red-500"
            >
              <Trash2 size={16} className="mr-2" /> Delete Product
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownMenu;

