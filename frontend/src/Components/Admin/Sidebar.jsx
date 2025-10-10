// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaFlag, FaCog, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Products", icon: <FaBox />, path: "/admin/products" },
    { name: "Reports", icon: <FaFlag />, path: "/admin/reports" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white h-screen p-4 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo + Hamburger */}
        <div className="flex items-center justify-between mb-8">
          {isOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-all ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

     
    </div>
  );
};

export default Sidebar;
