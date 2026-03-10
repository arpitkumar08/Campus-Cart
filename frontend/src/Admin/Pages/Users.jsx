import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminPageLayout from "../../Components/Admin/AdminPageLayout";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/users`);
        // Use res.data.users since your backend wraps the array inside an object
        setUsers(res.data.users || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
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
    return (
      name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Users"
      searchPlaceholder="Search user by name or email..."
      searchValue={search}
      onSearchChange={setSearch}
      columns={["User Id", "Name", "Email", "Joined", "Last Login"]}
      data={filteredUsers}
      emptyMessage="No users found"
      renderRow={(user) => (
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
            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </td>
        </tr>
      )}
    />
  );
};

export default Users;
