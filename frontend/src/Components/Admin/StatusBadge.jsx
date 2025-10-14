import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-600 border-green-300";
      case "Under Review":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "Open":
        return "bg-blue-100 text-blue-600 border-blue-300";
      case "Dismissed":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
