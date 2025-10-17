import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
        <p className="mb-6 text-sm text-gray-300">
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
