import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // temporary sample data — replace with backend API call later
  useEffect(() => {
    const sampleUsers = [
      {
        id: "USR001",
        name: "John Doe",
        email: "john@example.com",
        joined: "Jan 2025",
        lastLogin: "10 Oct 2025, 08:45 PM",
      },
      {
        id: "USR002",
        name: "Anna Smith",
        email: "anna@example.com",
        joined: "Feb 2025",
        lastLogin: "09 Oct 2025, 11:10 AM",
      },
      {
        id: "USR003",
        name: "David Lee",
        email: "david@example.com",
        joined: "Mar 2025",
        lastLogin: "11 Oct 2025, 06:30 PM",
      },
    ];
    setUsers(sampleUsers);
  }, []);

  // filtered users based on search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Users</h2>

          <input
            type="text"
            placeholder="Search user by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border text-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none bg-slate-800 placeholder-gray-400"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-50">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">User ID</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
                <th className="px-6 py-3 text-left font-semibold">Last Login</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t bg-slate-900 text-white hover:bg-gray-700"
                  >
                    <td className="px-6 py-3">{user.id}</td>
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.joined}</td>
                    <td className="px-6 py-3">{user.lastLogin}</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-400 hover:underline mr-3">
                        Edit
                      </button>
                      <button className="text-red-400 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
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
