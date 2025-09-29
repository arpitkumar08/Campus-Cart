import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../Context/socket";
import { SendHorizontal } from "lucide-react";

const ChatContainer = ({ selectedConversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Fetch messages & set up socket listeners whenever conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    socket.emit("join_conversation", selectedConversation._id);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chats/messages/${selectedConversation._id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
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


  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: userId,
      text: newMsg,
    };

    try {
      // ❌ REMOVE THIS LINE
      // socket.emit("send_message", messageData);

      // ✅ Just save to DB. The backend will emit automatically.
      await axios.post("http://localhost:5000/api/chats/messages", messageData);
      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };


  // If no conversation selected, show placeholder
  if (!selectedConversation)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    );

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-900">
      <h2 className="text-xl font-bold mb-4 text-white">
        Chat about: {selectedConversation.product?.title || "Product"}
      </h2>
      <div className="flex-1 overflow-y-auto border-2 border-gray-500 rounded-lg p-4 mb-4 flex flex-col gap-2">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === "string" ? msg.sender : msg.sender?._id;

          return (
            <div
              key={msg._id || index}
              className={`p-2 rounded ${senderId === userId
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-800 text-white self-start"
                }`}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      {/* Input field to type and send message */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();      // ✅ Prevents newline or form submission
              handleSendMessage();     // ✅ Trigger send
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
