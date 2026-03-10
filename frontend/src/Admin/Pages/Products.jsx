import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminPageLayout from "../../Components/Admin/AdminPageLayout";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/products`);
        setProducts(response.data.response || []);
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
    <AdminPageLayout
      title="Products"
      searchPlaceholder="Search by title, category or owner..."
      searchValue={search}
      onSearchChange={setSearch}
      columns={[
        "S.No",
        "Title",
        "Category",
        "Price",
        "Condition",
        "Status",
        "Owner",
        "Location",
        "Date",
      ]}
      data={filteredProducts}
      emptyMessage="No products found"
      renderRow={(product, index) => (
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
      )}
    />
  );
};

export default Products;
