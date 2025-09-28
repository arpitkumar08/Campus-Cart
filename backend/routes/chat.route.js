const express = require('express');
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
} = require('../controllers/chat.controller');

const router = express.Router();

// Conversations
router.post('/conversations', createConversation);
router.get('/conversations/:userId', getUserConversations);

// Messages
router.post('/messages', sendMessage);
router.get('/messages/:conversationId', getMessages);

module.exports = router;
