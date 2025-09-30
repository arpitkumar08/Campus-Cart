import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import ChatSidebar from "../../Pages/Chats/ChatSidebar";
import ChatContainer from "../../Pages/Chats/ChatContainer";
import NoChatSelected from "../../Pages/Chats/NoChatSelected";

const ChatPage = () => {
  const { conversationId } = useParams();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all conversations
  useEffect(() => {
    const fetchConvs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/chats/conversations/${user._id}`);
        setConversations(res.data);

        if (conversationId) {
          const conv = res.data.find((c) => c._id === conversationId);
          if (conv) handleSelectConversation(conv);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
  }, [user, conversationId]);

  // Esc key to close chat
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setSelectedConversation(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  // 🔹 When user opens a chat, mark as read
  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      await axios.post(
        `http://localhost:5000/api/chats/conversations/${conv._id}/read`,
        { userId: user._id }
      );
      // Update UI immediately
      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        conversations={conversations}
        setSelectedConversation={handleSelectConversation}
        userId={user?._id}
        loading={loading}
        selectedConversation={selectedConversation}
      />
      {selectedConversation ? (
        <ChatContainer
          selectedConversation={selectedConversation}
          userId={user._id}
        />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default ChatPage;
