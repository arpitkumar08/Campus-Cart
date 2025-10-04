import React from "react";

const ChatsSkeleton = () => {
  return (
    <div className="w-80 bg-gray-900 text-white h-full border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">
        Chats
      </h2>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 p-3 bg-gray-800 rounded-lg"
          >
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsSkeleton;
