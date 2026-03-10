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
  ];

  return (
    <div className="flex">
      <aside
        className={`bg-slate-900 text-white h-screen p-4 border-r border-gray-50 flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo + Hamburger */}
        <div className="flex items-center justify-between mb-8">
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
            }`}
          >
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button
            aria-label="Toggle Sidebar"
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars
              className={`transition-transform duration-500 ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-all duration-300 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              <span className="text-lg flex-shrink-0 transition-transform duration-300 hover:scale-110">
                {item.icon}
              </span>
              <span
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      <div
       
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Sidebar;
