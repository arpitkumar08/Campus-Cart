import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "./authStore";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "/api";

export const chatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = axios.get('/message/users')
        } catch (error) {
            
        }
    }
})) 