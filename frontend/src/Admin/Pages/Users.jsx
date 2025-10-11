import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users");
        // Use res.data.users since your backend wraps the array inside an object
        setUsers(res.data.users || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by name or email
  const filteredUsers = users.filter((user) => {
    const name = user.fullName || "";
    const email = user.email || "";
    const query = search.toLowerCase();
    return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Users</h2>

          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-82 border text-white border-gray-300 rounded-lg px-12 py-2 focus:outline-none bg-slate-800 placeholder-gray-400"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-50">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">User Id</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
                <th className="px-6 py-3 text-left font-semibold">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t bg-slate-900 text-white hover:bg-gray-700"
                  >
                    <td className="px-6 py-3">{user._id}</td>
                    <td className="px-6 py-3">{user.fullName || "N/A"}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
