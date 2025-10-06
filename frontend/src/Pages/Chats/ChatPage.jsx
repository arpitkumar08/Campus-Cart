import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore"; // Import Zustand store
import ChatSidebar from "../../Pages/Chats/ChatSidebar";
import ChatContainer from "../../Pages/Chats/ChatContainer";
import NoChatSelected from "../../Pages/Chats/NoChatSelected";

const ChatPage = () => {
  const { conversationId } = useParams();
  const { user } = useAuthStore();

  // ✅ Get state and actions from the central Zustand store
  const {
    conversations,
    getConversations,
    selectedConversation,
    setSelectedConversation,
  } = useChatStore();

  // You can get loading state from the store as well
  const loading = useChatStore((state) => state.isMessagesLoading);

  // Fetch conversations using the store's action when the component mounts
  useEffect(() => {
    if (user?._id) {
      getConversations();
    }
  }, [user, getConversations]);

  // Effect to select a conversation if its ID is in the URL
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c._id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, conversations]); // Intentionally not including setSelectedConversation

  // Effect to handle the 'Escape' key to deselect a conversation
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedConversation(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setSelectedConversation]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar Container */}
      {/* Takes full width on mobile, partial on desktop. */}
      {/* It's hidden on mobile screens ONLY when a conversation is selected. */}
      <div
        className={`
          w-full flex-shrink-0 transition-all duration-300
          md:w-1/3 lg:w-[380px] md:flex
          ${selectedConversation ? 'hidden md:flex' : 'flex'}
        `}
      >
        <ChatSidebar
          conversations={conversations}
          setSelectedConversation={setSelectedConversation}
          userId={user?._id}
          loading={loading}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Main Chat Area */}
      {/* Takes full width on mobile when a conversation is selected. */}
      <div
        className={`
          w-full flex-grow transition-all duration-300
          ${selectedConversation ? 'flex' : 'hidden md:flex'}
        `}
      >
        {selectedConversation ? (
          <ChatContainer
            selectedConversation={selectedConversation}
            userId={user._id}
            // ✅ Pass a function to handle going back on mobile
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          // This will now only be visible on desktop when no chat is selected
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
