const express = require("express");
const router = express.Router();
const chatCtrl = require("../controllers/chat.controller");
const Conversation = require("../models/conversation.model"); // <-- add this import



// Create or get a conversation between two users
router.post("/conversations", chatCtrl.createConversation);

// Get all conversations for a user (with unread counts)
router.get("/conversations/:userId", chatCtrl.getUserConversations);

// Mark a conversation as read for a specific user
// BODY: { userId: "<id-of-user-who-opened-the-chat>" }
router.post("/conversations/:conversationId/read", chatCtrl.markAsRead);

// -------------------------
// Message Routes
// -------------------------

// Send a message inside a conversation
router.post("/messages", chatCtrl.sendMessage);

// Get all messages of a conversation
router.get("/messages/:conversationId", chatCtrl.getMessages);

module.exports = router;
