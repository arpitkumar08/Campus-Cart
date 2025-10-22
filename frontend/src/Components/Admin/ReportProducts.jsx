import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import DropdownMenu from "../../Components/Admin/DropdownMenu";

const ProductRow = ({ report, onActionComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className="border-b border-white/20 hover:bg-zinc-800/60 transition-colors">
      <td className="py-3 px-4 font-mono">{report._id}</td>
      <td className="py-3 px-4">{report.reportedProduct?._id || "N/A"}</td>
      <td className="py-3 px-4 text-gray-400">{report.reporter?.email || "N/A"}</td>
      <td className="py-3 px-4">{report.reason}</td>
      <td className="py-3 px-4">{new Date(report.createdAt).toLocaleDateString()}</td>
      <td className="py-3 px-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:text-blue-400"
        >
          <MoreHorizontal size={18} />
        </button>
        {isOpen && (
          <DropdownMenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            type="product"
            productId={report._id} // ✅ report _id
            onActionComplete={onActionComplete} // ✅ refresh table after action
          />
        )}
      </td>
    </tr>
  );
};

const ReportProducts = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/reports", {
        withCredentials: true,
      });
      const filtered = res.data.filter((r) => r.reportedType === "Product");
      setReports(filtered);
    } catch (err) {
      console.error("Error fetching product reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="text-white px-6 py-6">
      <h1 className="text-2xl font-semibold mb-6">Reported Products</h1>

      <div className="border border-gray-50 rounded-xl p-4 bg-slate-900/50">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-400">No reported products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left py-3 px-4">Report ID</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Reporter</th>
                  <th className="text-left py-3 px-4">Reason</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <ProductRow
                    key={report._id}
                    report={report}
                    onActionComplete={fetchReports} // ✅ refresh parent table
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportProducts;
