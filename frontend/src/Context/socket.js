import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000"); // connect to backend
export const SocketContext = createContext(socket);
