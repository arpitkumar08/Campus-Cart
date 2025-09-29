import { createContext } from "react";
import { io } from "socket.io-client";

console.log("🌐 Connecting to Socket.IO backend...");
export const socket = io("http://localhost:5000");
export const SocketContext = createContext(socket);

socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});
