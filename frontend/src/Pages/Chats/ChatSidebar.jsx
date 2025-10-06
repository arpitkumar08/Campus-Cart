import React from "react";
import SidebarSkeleton from "../../Components/Skeletons/SidebarSkeleton";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/useChatStore"; // ✅ import store for marking read

const ChatSidebar = ({
  conversations,
  setSelectedConversation,
  userId,
  loading,
  selectedConversation,
}) => {
  const navigate = useNavigate();
  const markAsRead = useChatStore((state) => state.markAsRead); // ✅ mark conversation read

  if (loading) return <SidebarSkeleton />;

  return (
    <div className="w-full bg-gray-900 text-white h-full b flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700 flex items-center gap-2">
        <FaArrowLeft
          className="cursor-pointer hover:text-slate-400"
          onClick={() => navigate("/")}
        />
        Chats
      </h2>

      <div className="flex-1 overflow-y-auto">
        {(!conversations || conversations.length === 0) ? (
          <p className="text-gray-400 text-center mt-4">No chats yet</p>
        ) : (
          conversations.map((conv) => {
            const participants = conv.participants || [];
            const otherUser = participants.find(
              (p) => (p._id || p.id)?.toString() !== userId?.toString()
            );
            const isActive = selectedConversation?._id === conv._id;
            const unread = conv.unreadCount || 0;

          

            return (
              <div
                key={conv._id}
                onClick={() => {
                  setSelectedConversation(conv);
                  if (unread > 0) {
                    markAsRead(conv._id); // ✅ clear unread count
                  }
                }}
                className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition ${
                  isActive ? "bg-gray-800" : ""
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {conv.product?.title || "No Product"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {otherUser ? otherUser.fullName : "Unknown"}
                  </p>
                </div>
                {unread > 0 && !isActive && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
