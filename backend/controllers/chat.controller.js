const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')



// Create or Get Conversation
exports.createConversation = async (req, res) => {
  try {
    const { senderId, receiverId, product } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      product,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        product,
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all conversations for a user
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    }).populate("participants", "name email");

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    const message = new Message({
      conversationId,
      sender: senderId,
      text,
    });

    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).populate(
      "sender",
      "name email"
    );

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

