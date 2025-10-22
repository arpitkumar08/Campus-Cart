import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, Trash2 } from "lucide-react";
import axios from "axios";

const DropdownMenu = ({
  isOpen,
  onClose,
  type,
  userId,
  productId, // report _id
  onActionComplete, // callback to refresh parent data
}) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDelete = async (e) => {

    console.log("handleDelete clicked")
    e.stopPropagation();
    if (type !== "product" || !productId) return;

    try {
      await axios.delete(`http://localhost:5000/api/reports/${productId}`, { withCredentials: true, }
      );
      
      if (onActionComplete) onActionComplete(); // refresh table
    } catch (err) {
      console.error("Error deleting report:", err);
    }
    onClose();
  };

  const handleSuspend = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/suspenduser/${userId}`,
        {},
        { withCredentials: true }
      );
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Error suspending user:", err);
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
          <button
            onClick={handleSuspend}
            className="flex items-center w-full px-3 py-2 text-sm hover:bg-zinc-700 text-yellow-400"
          >
            <UserX size={16} className="mr-2" /> Suspend User
          </button>

          {type === "product" && (
            <button
              onClick={handleDelete}
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
