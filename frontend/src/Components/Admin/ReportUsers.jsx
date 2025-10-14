import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import DropdownMenu from "../../Components/Admin/DropdownMenu";
import axios from "axios";



// ✅ Row component for each user
const UserRow = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:500/api/admin/")
      } catch (error) {
        
      }
    }
  })


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <tr
      key={user.id}
      className="border-b border-white/20 hover:bg-zinc-800/60 transition-colors"
    >
      <td className="py-3 px-4 font-mono">{user.userId}</td>
      <td className="py-3 px-4">{user.username}</td>
      <td className="py-3 px-4 text-gray-400">{user.reporter}</td>
      <td className="py-3 px-4">{user.reason}</td>
      <td className="py-3 px-4">{user.date}</td>

      {/* Actions */}
      <td className="py-3 px-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:text-blue-400"
        >
          <MoreHorizontal size={18} />
        </button>

        {/* DropdownMenu receives isOpen */}
        <DropdownMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="user"
        />
      </td>
    </tr>
  );
};

const ReportUsers = () => {
  // Dummy reported users
  const reportedUsers = [
    {
      id: 1,
      userId: "USR-9001",
      username: "scammer123",
      reporter: "alice_brown",
      reason: "Fraudulent activity",
      date: "2025-10-11",
    },
    {
      id: 2,
      userId: "USR-9002",
      username: "fake_seller",
      reporter: "bob_martin",
      reason: "Multiple fake listings",
      date: "2025-10-10",
    },
    {
      id: 3,
      userId: "USR-9003",
      username: "spam_bot_99",
      reporter: "carol_davis",
      reason: "Spam messages",
      date: "2025-10-09",
    },
    {
      id: 4,
      userId: "USR-9004",
      username: "legit_user",
      reporter: "dan_lee",
      reason: "False report",
      date: "2025-10-08",
    },
  ];

  return (
    <div className="text-white px-6 py-6">
      <h1 className="text-2xl font-semibold mb-6">Reported Users</h1>

      <div className="border border-gray-50 rounded-xl p-4 bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-left py-3 px-4">Username</th>
                <th className="text-left py-3 px-4">Reporter</th>
                <th className="text-left py-3 px-4">Reason</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reportedUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportUsers;
