import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../../Context/socket";
import { SendHorizontal, ArrowLeft } from "lucide-react";

const ChatContainer = ({ selectedConversation, userId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Effect to fetch messages and handle socket events
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
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedConversation]);

  // Effect to auto-scroll to the bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: userId,
      text: newMsg,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats/messages",
        messageData
      );
      socket.emit("send_message", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMsg("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };
  
  // Find the other participant in the conversation to display their name
  const otherUser = selectedConversation?.participants.find(p => p._id !== userId);

  return (
    <div className="flex flex-col h-full w-full">
      {/* ✅ Responsive Header */}
      <div className="flex items-center p-3 border-b border-gray-700 bg-gray-900 flex-shrink-0">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-700 transition-colors md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex flex-col">
          <span className="font-bold text-white text-lg">
            {otherUser?.fullName || "Chat"}
          </span>
          <span className="text-sm text-gray-400">
            Regarding: {selectedConversation.product?.title || "Item"}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading ? (
           <div className="m-auto text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="m-auto text-gray-400">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => {
            const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
            const isSentByMe = senderId === userId;
            return (
              <div
                key={msg._id || index}
                className={`p-3 rounded-lg max-w-md text-white ${
                  isSentByMe
                    ? "bg-blue-600 self-end"
                    : "bg-gray-700 self-start"
                }`}
              >
                {msg.text}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="flex gap-2 p-4 bg-gray-900 border-t border-gray-700">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 p-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!newMsg.trim()}
        >
          <SendHorizontal size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;

