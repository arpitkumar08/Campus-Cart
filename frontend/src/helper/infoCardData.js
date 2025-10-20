import { Users, Package, ShoppingBag, Box } from "lucide-react";
import axios from "axios";

export const getCardData = async () => {
  try {
    const [usersRes, productsRes, reportsRes, soldRes] = await Promise.all([
      axios.get("http://localhost:5000/api/admin/users/count", { withCredentials: true }),
      axios.get("http://localhost:5000/api/admin/products/count", { withCredentials: true }),
      axios.get("http://localhost:5000/api/admin/reportedProducts/count", { withCredentials: true }),
      axios.get("http://localhost:5000/api/admin/products/sold/count", { withCredentials: true }),

    ]);

    return [
      {
        title: "Total Users",
        value: usersRes.data.count,
        // change: "+8.2%",
        trend: "up",
        icon: Users,
        color: "blue",
      },
      {
        title: "Total Products",
        value: productsRes.data.count,
        // change: "+3.4%",
        trend: "up",
        icon: Package,
        color: "green",
      },
      {
        title: "Total Reports",
        value: reportsRes.data.count,
        // change: "-2.1%",
        trend: "down",
        icon: ShoppingBag,
        color: "orange",
      },
      {
        title: "Total Items Sold",
        value: soldRes.data.count, // no endpoint yet, fallback
        // change: "+6.5%",
        trend: "up",
        icon: Box,
        color: "purple",
      },
    ];
  } catch (error) {
    console.error("Error fetching card data:", error);

    return [
      { title: "Total Users", value: "-", change: "-", trend: "up", icon: Users, color: "blue" },
      { title: "Total Products", value: "-", change: "-", trend: "up", icon: Package, color: "green" },
      { title: "Total Reports", value: "-", change: "-", trend: "down", icon: ShoppingBag, color: "orange" },
      { title: "Total Items Sold", value: "-", change: "+6.5%", trend: "up", icon: Box, color: "purple" },
    ];
  }
};
