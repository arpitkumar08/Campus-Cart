import React, { useState } from "react";

const ReportProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 text-white rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Report Product</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ reason, details });
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col text-sm">
            Reason
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="mt-1 p-2 bg-slate-800 rounded-md border border-gray-600 focus:outline-none"
            >
              <option value="">Select reason</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="scam">Scam or fraud</option>
              <option value="duplicate">Duplicate listing</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="flex flex-col text-sm">
            Additional details (optional)
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1 p-2 bg-slate-800 rounded-md border border-gray-600 focus:outline-none"
              rows="3"
              placeholder="Describe the issue..."
            />
          </label>

          <button
            type="submit"
            className="mt-2 bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportProductModal;
