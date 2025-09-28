import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../Context/socket";

const ChatContainer = ({ selectedConversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

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
        console.error(err);
      }
    };

    fetchMessages();

    socket.on("receive_message", (message) => {
      if (message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: userId,
      text: newMsg,
    };

    socket.emit("send_message", messageData); // real-time

    // Save in DB via REST
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

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-900">
      <h2 className="text-xl font-bold mb-4 text-white">
        Chat about: {selectedConversation.product.title}
      </h2>
      <div className="flex-1 overflow-y-auto border-2 border-gray-500 rounded-lg p-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 rounded ${
              msg.sender._id === userId ? "bg-blue-600 text-white self-end" : "bg-gray-800 text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
