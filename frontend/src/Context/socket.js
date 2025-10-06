// Context/socket.js
import { io } from "socket.io-client";

// Replace with your backend URL
export const socket = io("http://localhost:5000", {
  withCredentials: true,
});

// Debug connection
socket.on("connect", () => {
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

// Debug all incoming events
socket.onAny((event, ...args) => {
  console.log("📡 Incoming event:", event, args);
});
