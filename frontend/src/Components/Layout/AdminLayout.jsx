// AdminLayout.jsx
import React from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-zinc-900 p-6 overflow-y-auto">
        {/* This renders the current page */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
