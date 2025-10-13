import axios from "axios";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/products");
        setProducts(response.data.response || []);
        console.log(response)
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // No fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Run once on component mount

  // Filter products by title, category, or owner name
  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.owner?.fullName || "").toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        Loading products...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Products</h2>

          <input
            type="text"
            placeholder="Search by title, category or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-86 border text-white border-gray-300 rounded-lg px-12 py-2 focus:outline-none bg-slate-800 placeholder-gray-400"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-50">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">S.No</th>
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Condition</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Owner</th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className="border-t bg-slate-900 text-white hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-white">{product.title}</td>
                    <td className="px-6 py-3">{product.category}</td>
                    <td className="px-6 py-3">₹{product.price}</td>
                    <td className="px-6 py-3">{product.condition}</td>
                    <td
                      className={`px-6 py-3 font-semibold ${
                        product.status === "Available" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {product.status}
                    </td>
                    <td className="px-6 py-3">{product.owner?.fullName || "N/A"}</td>
                    <td className="px-6 py-3">{product.location}</td>
                    <td className="px-6 py-3">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-500 bg-slate-900"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
