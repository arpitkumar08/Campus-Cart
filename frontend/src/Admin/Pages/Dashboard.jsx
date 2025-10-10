import React from "react";
import InfoCard from "../../Components/Admin/InfoCard";
import { Users, Package, ShoppingBag, Box } from "lucide-react";
import Sidebar from "../../Components/Admin/Sidebar";
import ChartsSection from "../../Components/Admin/ChartSection";

const Dashboard = () => {
  const cardData = [
    {
      title: "Total Users",
      value: "1,240",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Products",
      value: "586",
      change: "+3.4%",
      trend: "up",
      icon: Package,
      color: "green",
    },
    {
      title: "Total Reports",
      value: "322",
      change: "-2.1%",
      trend: "down",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Items Sold",
      value: "950",
      change: "+6.5%",
      trend: "up",
      icon: Box,
      color: "purple",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Dashboard Overview
        </h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>

        {/* Charts Section */}
        <ChartsSection />
      </div>
    </div>
  );
};

export default Dashboard;
