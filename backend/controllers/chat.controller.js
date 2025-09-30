const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

/**
 * Create conversation or return existing
 */
exports.createConversation = async (req, res) => {
  const { senderId, receiverId, product } = req.body;
  if (!senderId || !receiverId || !product)
    return res.status(400).json({ error: "Missing senderId, receiverId or product" });

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
    product
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      product,
      unreadCounts: { [receiverId]: 0, [senderId]: 0 }
    });
  }

  res.json(conversation);
};

/**
 * Get all conversations for a user
 */
exports.getUserConversations = async (req, res) => {
  const { userId } = req.params;
  const conversations = await Conversation.find({
    participants: { $in: [userId] }
  })
    .sort({ updatedAt: -1 })
    .populate([{ path: "participants", select: "fullName email" },
               { path: "product", select: "title images price" }]);

  // Attach unreadCount for this user
  const result = conversations.map((c) => ({
    ...c.toObject(),
    unreadCount: c.unreadCounts?.get(userId) || 0
  }));

  res.json(result);
};

/**
 * Send message and increment unread counts for others
 */
exports.sendMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  if (!conversationId || !senderId || !text)
    return res.status(400).json({ error: "Missing fields" });

  const message = await Message.create({
    conversationId,
    sender: senderId,
    text
  });

  // Increment unread count for other participants
  const conv = await Conversation.findById(conversationId);
  conv.participants.forEach((p) => {
    if (p.toString() !== senderId) {
      const prev = conv.unreadCounts?.get(p.toString()) || 0;
      conv.unreadCounts.set(p.toString(), prev + 1);
    }
  });
  await conv.save();

  const populated = await message.populate({ path: "sender", select: "fullName email" });
  res.json(populated);
};

/**
 * Mark conversation as read for a user
 */
exports.markAsRead = async (req, res) => {
  const { userId } = req.body;
  const { conversationId } = req.params;

  const conv = await Conversation.findById(conversationId);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });

  conv.unreadCounts.set(userId, 0);
  await conv.save();

  res.json({ success: true });
};

/**
 * Get messages of a conversation
 */
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate("sender", "fullName email");
  res.json(messages);
};
