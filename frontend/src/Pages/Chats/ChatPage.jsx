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

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/chats/conversations/${user._id}`
        );
        setConversations(res.data);

        // Auto-select conversation from URL param or first conversation
        if (conversationId) {
          const conv = res.data.find((c) => c._id === conversationId);
          setSelectedConversation(conv || null);
        } else {
          setSelectedConversation(res.data[0] || null);
        }
      } catch (err) {
        console.error("❌ Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, conversationId]);

  // Listen for ESC key to deselect conversation
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setSelectedConversation(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <ChatSidebar
        conversations={conversations}
        setSelectedConversation={setSelectedConversation}
        userId={user?._id}
        loading={loading}
      />

      {/* Show chat or placeholder */}
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
