import React from "react";
import SidebarSkeleton from "../../Components/Skeletons/SidebarSkeleton"; // Make sure you have the skeleton component

const ChatSidebar = ({ conversations, setSelectedConversation, userId, loading }) => {
  console.log("📋 Rendering ChatSidebar. Conversations:", conversations?.length || 0);

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="w-80 bg-gray-900 text-white h-full border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">Chats</h2>

      <div className="flex-1 overflow-y-auto">
        {!conversations || conversations.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No chats yet</p>
        ) : (
          conversations.map((conv) => {
            const participants = conv.participants || [];

            const otherUser = participants.find(
              (p) => (p._id || p.id)?.toString() !== userId?.toString()
            );

            const currentUser = participants.find(
              (p) => (p._id || p.id)?.toString() === userId?.toString()
            );

            console.log("🔎 Participants:", participants);
            console.log("🔍 Current User:", currentUser);
            console.log("✅ Filtered otherUser:", otherUser);

            return (
              <div
                key={conv._id}
                onClick={() => {
                  console.log("✅ Selected Conversation:", conv._id);
                  setSelectedConversation(conv);
                }}
                className="flex flex-col p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <p className="font-semibold">{conv.product?.title || "No Product"}</p>
                <p className="text-sm text-gray-400">
                  {otherUser
                    ? otherUser.fullName || otherUser.name || "Unnamed User"
                    : participants.length === 1
                      ? "Waiting for other user..."
                      : "Unknown User"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
