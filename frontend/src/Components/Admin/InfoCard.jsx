import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

const InfoCard = ({ title, value, change, icon: Icon, trend, color }) => {
  return (
    <div className="bg-gray-950 h-38 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p
          className={`text-sm font-medium flex items-center gap-1 ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span>{change}</span>
          <span className="text-gray-400">vs last month</span>
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
