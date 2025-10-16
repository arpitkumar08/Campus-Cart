import React, { useState } from "react";
import { X } from "lucide-react"; // for close icon

const ReportUserModal = ({ isOpen, onClose, onSubmit, reportedType = "User", reportedId }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form data structure matching your schema
    const reportData = {
      reason,
      details,
      reportedType,
      ...(reportedType === "User"
        ? { reportedUser: reportedId }
        : { reportedProduct: reportedId }),
    };

    onSubmit(reportData); // send data to parent or API
    setReason("");
    setDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center  pb-2 mb-4">
          <h2 className="text-xl font-semibold">Report {reportedType}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reason *</label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border bg-slate-900 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              <option value="">Select reason</option>
              <option value="Scam or Fraud">Scam or Fraud</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Details (optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide more information..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white rounded-lg py-2 font-semibold hover:bg-red-600 transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportUserModal;
