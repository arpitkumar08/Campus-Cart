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

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/chats/conversations/${user._id}`
        );
        setConversations(res.data);

        if (conversationId) {
          const conv = res.data.find((c) => c._id === conversationId);
          setSelectedConversation(conv);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, [user, conversationId]);

  return (
    <div className="flex h-screen">
      <ChatSidebar
        conversations={conversations}
        setSelectedConversation={setSelectedConversation}
        userId={user?._id}
      />

      {/* Show chat or placeholder */}
      {selectedConversation ? (
        <ChatContainer selectedConversation={selectedConversation} userId={user._id} />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default ChatPage;
