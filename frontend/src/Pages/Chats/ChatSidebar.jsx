import React from "react";

const ChatSidebar = ({ conversations, setSelectedConversation, userId }) => {
  return (
    <div className="w-80 bg-gray-900 text-white h-full border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">Chats</h2>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No chats yet</p>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.participants.find((p) => p._id !== userId);
            return (
              <div
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className="flex flex-col p-4 cursor-pointer border-b-1 border-gray-700 hover:bg-gray-800 transition"
              >
                {/* Fix: render product title */}
                <p className="font-semibold">{conv.product.title}</p>
                <p className="text-sm text-gray-400">{otherUser?.fullName}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
