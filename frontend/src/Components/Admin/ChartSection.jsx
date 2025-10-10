import React from "react";
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
import { COLORS } from "../../helper/colorData";

const userData = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1000 },
  { month: "May", users: 1200 },
];

const productData = [
  { month: "Jan", products: 200 },
  { month: "Feb", products: 450 },
  { month: "Mar", products: 700 },
  { month: "Apr", products: 650 },
  { month: "May", products: 800 },
];

const categoryData = [
  { name: "Electronics", value: 120 },
  { name: "Books & Study Materials", value: 90 },
  { name: "Clothing", value: 150 },
  { name: "Furniture", value: 70 },
  { name: "Sports & Fitness", value: 60 },
  { name: "Kitchen & Dining", value: 80 },
  { name: "Musical Instruments", value: 40 },
  { name: "Room Decor", value: 50 },
  { name: "Transportation", value: 30 },
  { name: "Other", value: 20 },
];

const reportData = [
  { name: "Fake Products", value: 120 },
  { name: "Scams", value: 90 },
  { name: "Inappropriate Content", value: 60 },
];

const ChartsSection = () => {
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
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
