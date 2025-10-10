import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { COLORS } from "../../helper/colorData";

const ChartsSection = () => {
  const [userData, setUserData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // User growth
        const userRes = await axios.get("http://localhost:5000/api/admin/charts/users", { withCredentials: true });
        setUserData(userRes.data);

        // Product growth
        const productRes = await axios.get("http://localhost:5000/api/admin/charts/products", { withCredentials: true });
        setProductData(productRes.data);

        // Products by category
        const categoryRes = await axios.get("http://localhost:5000/api/admin/charts/categories", { withCredentials: true });
        setCategoryData(categoryRes.data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Line Chart - User Growth */}
      <div className="bg-slate-900 border border-gray-50 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">
          User Growth Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#334155", border: "none" }} />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Products Added */}
      <div className="bg-slate-900 border border-gray-50 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Products Added Per Month
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
            <Legend />
            <Bar dataKey="products" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Products by Category */}
      <div className="bg-slate-900 border border-gray-50 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Products by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
