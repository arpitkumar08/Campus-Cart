// Context/socket.js
import { io } from "socket.io-client";

// Replace with your backend URL
export const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: true,     // automatically connect
  reconnection: true,    // try to reconnect on disconnect
  reconnectionAttempts: 5, // max attempts
  reconnectionDelay: 2000, // 2 seconds between attempts
});

// Log successful connection
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

// Log disconnections
socket.on("disconnect", (reason) => {
  console.warn("❌ Socket disconnected:", reason);
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error("⚠️ Connection error:", err.message);
});

// Debug all incoming events
socket.onAny((event, ...args) => {
  console.log("📡 Incoming event:", event, args);
});

// Optional: helper to emit events safely
export const emitEvent = (event, data) => {
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn(`⚠️ Cannot emit, socket disconnected: ${event}`, data);
  }
};

export default socket;
