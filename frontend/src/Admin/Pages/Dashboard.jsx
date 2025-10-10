import React, { useEffect, useState } from "react";
import InfoCard from "../../Components/Admin/InfoCard";
import ChartsSection from "../../Components/Admin/ChartSection";
import { getCardData } from "../../helper/infoCardData";

const Dashboard = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchCardData = async () => {
      const data = await getCardData();
      setCardData(data);
    };

    fetchCardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard Overview</h1>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <ChartsSection />
    </div>
  );
};

export default Dashboard;
