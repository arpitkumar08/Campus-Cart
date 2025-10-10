import { Users, Package, ShoppingBag, Box } from "lucide-react";
import axios from "axios";

// Function to fetch counts from backend and return card data
export const getCardData = async () => {
  try {
    const [usersRes, productsRes, reportsRes, itemsSoldRes] = await Promise.all([
      axios.get("/api/admin/users/count", { withCredentials: true }),
      axios.get("/api/admin/products/count", { withCredentials: true }),
      axios.get("/api/admin/reports/count", { withCredentials: true }),
      axios.get("/api/admin/items-sold/count", { withCredentials: true }),
    ]);

    return [
      {
        title: "Total Users",
        value: usersRes.data.count,
        change: "+8.2%", // you can optionally fetch from backend
        trend: "up",
        icon: Users,
        color: "blue",
      },
      {
        title: "Total Products",
        value: productsRes.data.count,
        change: "+3.4%",
        trend: "up",
        icon: Package,
        color: "green",
      },
      {
        title: "Total Reports",
        value: reportsRes.data.count,
        change: "-2.1%",
        trend: "down",
        icon: ShoppingBag,
        color: "orange",
      },
      {
        title: "Total Items Sold",
        value: itemsSoldRes.data.count,
        change: "+6.5%",
        trend: "up",
        icon: Box,
        color: "purple",
      },
    ];
  } catch (error) {
    console.error("Error fetching card data:", error);
    return []; // return empty array on error
  }
};
