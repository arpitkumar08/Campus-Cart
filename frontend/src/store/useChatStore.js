import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "./useAuthStore";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "/api";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    conversations: [],
    selectedConversation: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // This function assumes its route is correct as per your setup.
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axios.get(`${API_URL}/message/users`, {
                withCredentials: true,
            });
            console.log("✅ Users fetched:", res.data);
            set({
                users: res.data,
                isUsersLoading: false,
            });
        } catch (error) {
            console.error("❌ Error fetching users:", error);
            toast.error("Failed to load users");
            set({ isUsersLoading: false });
        }
    },


    getConversations: async () => {
        try {
            const user = useAuthStore.getState().user;

            if (!user?._id) {
                console.error("2. FAILURE: No user is logged in.");
                return;
            }


            // ✅ FIX: Added the '/chats' prefix to match the server route configuration.
            const apiUrl = `${API_URL}/chats/conversations/${user._id}`;

            const res = await axios.get(apiUrl, { withCredentials: true });

            set({ conversations: res.data });

        } catch (error) {
            console.error("4. FAILURE: Error fetching conversations.", error.response?.data || error.message);
        }
    },

    setSelectedConversation: async (conversation) => {
        set({ selectedConversation: conversation });
        if (conversation?._id) {
            await get().markAsRead(conversation._id);
        }
    },

    markAsRead: async (conversationId) => {
        try {
            const user = useAuthStore.getState().user;
            if (!user?._id) return;

            // ✅ FIX: Added the '/chats' prefix to match the server route configuration.
            await axios.post(`${API_URL}/chats/conversations/${conversationId}/read`,
                { userId: user._id },
                { withCredentials: true }
            );

            set((state) => ({
                conversations: state.conversations.map((conv) =>
                    conv._id === conversationId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                ),
            }));
        } catch (error) {
            console.error("❌ Error marking as read:", error);
        }
    },

    getMessages: async (conversationId) => {
        set({ isMessagesLoading: true });
        try {
            // ✅ FIX: Added the '/chats' prefix to match the server route configuration.
            const res = await axios.get(`${API_URL}/chats/messages/${conversationId}`, {
                withCredentials: true,
            });
            set({
                messages: res.data,
                isMessagesLoading: false,
            });
            await get().markAsRead(conversationId);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
            toast.error("Failed to load messages");
            set({ isMessagesLoading: false });
        }
    },

    getUnreadCount: () => {
        const conversations = get().conversations;
        return conversations.reduce(
            (sum, conv) => sum + (conv.unreadCount || 0),
            0
        );
    },

    incrementUnreadCount: (conversationId) => {
        set((state) => ({
            conversations: state.conversations.map((conv) =>
                conv._id === conversationId
                    ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
                    : conv
            ),
        }));
    },
}));
