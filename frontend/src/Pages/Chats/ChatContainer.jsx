import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../Context/socket";
import { SendHorizontal } from "lucide-react";

// ✅ Skeleton loader for chat messages
const ChatSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-900">
      <h2 className="text-xl font-bold mb-4 text-white">Loading Chat...</h2>
      <div className="flex-1 overflow-y-auto border-2 border-gray-500 rounded-lg p-4 mb-4 flex flex-col gap-3 animate-pulse">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xs ${
              idx % 2 === 0
                ? "self-start bg-gray-700 w-40 h-4"
                : "self-end bg-blue-700 w-32 h-4"
            }`}
          ></div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 p-2 rounded bg-gray-800 h-10"></div>
        <div className="bg-blue-600 p-2 rounded h-10 w-10"></div>
      </div>
    </div>
  );
};

const ChatContainer = ({ selectedConversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedConversation) return;

    socket.emit("join_conversation", selectedConversation._id);

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/chats/messages/${selectedConversation._id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (message) => {
      if (message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: userId,
      text: newMsg,
    };

    try {
      await axios.post("http://localhost:5000/api/chats/messages", messageData);
      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedConversation)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    );

  if (loading) return <ChatSkeleton />;

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-900">
      <h2 className="text-xl font-bold mb-4 text-white">
        Chat about: {selectedConversation.product?.title || "Product"}
      </h2>

      <div className="flex-1 overflow-y-auto border-2 border-gray-500 rounded-lg p-4 mb-4 flex flex-col gap-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet</div>
        ) : (
          messages.map((msg, index) => {
            const senderId =
              typeof msg.sender === "string" ? msg.sender : msg.sender?._id;

            return (
              <div
                key={msg._id || index}
                className={`p-2 rounded max-w-xs ${
                  senderId === userId
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-800 text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />

        <button
          onClick={handleSendMessage}
          className="bg-blue-600 p-2 rounded flex items-center justify-center"
        >
          <SendHorizontal size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
