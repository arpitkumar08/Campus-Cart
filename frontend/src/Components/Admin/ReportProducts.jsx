import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import DropdownMenu from "../../Components/Admin/DropdownMenu";
import axios from "axios";

// ✅ Row component for each product
const ProductRow = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
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
      <td className="py-3 px-4 font-mono">{report.productId}</td>
      <td className="py-3 px-4 font-mono">{report.userId}</td>
      <td className="py-3 px-4">{report.product}</td>
      <td className="py-3 px-4 text-gray-400">{report.reporter}</td>
      <td className="py-3 px-4">{report.reason}</td>
      <td className="py-3 px-4">{report.date}</td>

      {/* Actions */}
      <td className="py-3 px-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:text-blue-400"
        >
          <MoreHorizontal size={18} />
        </button>

        <DropdownMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="product"
        />
      </td>
    </tr>
  );
};

const ReportProducts = () => {
  const [reportedProducts, setReportedProducts] = useState([
    {
      id: 1,
      productId: "PRD-1001",
      userId: "USR-5521",
      product: "Vintage Leather Jacket",
      reporter: "john_doe",
      reason: "Counterfeit item",
      date: "2025-10-10",
    },
    {
      id: 2,
      productId: "PRD-1002",
      userId: "USR-5522",
      product: "iPhone 15 Pro Max",
      reporter: "sarah_smith",
      reason: "Misleading description",
      date: "2025-10-09",
    },
    {
      id: 3,
      productId: "PRD-1003",
      userId: "USR-5533",
      product: "Adidas Sneakers",
      reporter: "mike_92",
      reason: "Fake brand logo",
      date: "2025-10-08",
    },
    {
      id: 4,
      productId: "PRD-1004",
      userId: "USR-5544",
      product: "Bluetooth Headphones",
      reporter: "anna_k",
      reason: "Not as described",
      date: "2025-10-06",
    },
  ]);

  // Optional: fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports",
          { withCredentials: true }
        );
        console.log(response)
        setReportedProducts(response.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="text-white px-6 py-6">
      <h1 className="text-2xl font-semibold mb-6">Reported Products</h1>

      <div className="border border-gray-50 rounded-xl p-4 bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left py-3 px-4">Product ID</th>
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Reporter</th>
                <th className="text-left py-3 px-4">Reason</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reportedProducts.map((report) => (
                <ProductRow key={report.id} report={report} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportProducts;
