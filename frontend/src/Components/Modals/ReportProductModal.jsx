import React, { useState, useEffect } from "react";
import axios from "axios";

const ReportModal = ({ isOpen, onClose, item, type }) => {
  // item = product or user object
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setDetails("");
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return alert("Please select a reason for reporting.");

    try {
      setLoading(true);
      const payload = {
        type, // 'product' or 'user'
        id: type === "product" ? item.productId : item.userId,
        reason,
        details,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        payload,
        { withCredentials: true }
      );

      alert(res.data.message || "Report submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 text-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Report {type === "product" ? item.product : item.username}
        </h2>

        {/* Show item details */}
        <div className="mb-4 text-sm text-gray-400">
          {type === "product" ? (
            <>
              <p>
                <strong>Product ID:</strong> {item.productId}
              </p>
              <p>
                <strong>Reported by:</strong> {item.reporter}
              </p>
              <p>
                <strong>Reason:</strong> {item.reason}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>User ID:</strong> {item.userId}
              </p>
              <p>
                <strong>Username:</strong> {item.username}
              </p>
              <p>
                <strong>Reported by:</strong> {item.reporter}
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col text-sm">
            Reason for reporting
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
            disabled={loading}
            className="mt-2 bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
