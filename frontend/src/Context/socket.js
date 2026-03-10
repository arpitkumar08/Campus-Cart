// Context/socket.js
import { io } from "socket.io-client";

// Replace with your backend URL
export const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

// Handle connection errors silently (optional toast or retry logic can go here)
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

// Optional: safe emit helper
export const emitEvent = (event, data) => {
  if (socket.connected) {
    socket.emit(event, data);
  }
};

export default socket;
