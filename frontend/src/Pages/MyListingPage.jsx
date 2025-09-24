import React from "react";
import { useNavigate } from "react-router-dom";
import MyListings from "./components/Products/MyListings";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft } from "lucide-react";

const MyListingsPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBack = () => navigate("/");

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Back Button - fixed so always visible */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-gray-800/90 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition-colors backdrop-blur-sm"
      >
        dfsf
        <ArrowLeft className="w-6 h-6" />
        <span className="font-medium text-lg">Back</span>
      </button>

      {/* My Listings Component */}
      <div className="pt-16">
        <MyListings user={user} />
      </div>
    </div>
  );
};

export default MyListingsPage;