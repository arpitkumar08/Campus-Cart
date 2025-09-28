const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

// ✅ Create or Get Conversation
exports.createConversation = async (req, res) => {
  try {
    const { senderId, receiverId, product } = req.body;
    console.log({ senderId, receiverId, product }); // ✅ debug

    if (!senderId || !receiverId || !product) {
      return res.status(400).json({ error: "Missing sender, receiver, or product" });
    }

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all conversations for a user
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .sort({ updatedAt: -1 }) // ✅ newest first
      .populate([
        { path: 'participants', select: 'fullName email' },
        { path: 'product', select: 'title images price' }
      ]);

    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text, image } = req.body;

    const message = new Message({
      conversationId,
      sender: senderId,
      text,
      image,
    });

    await message.save();

    // ✅ update conversation.updatedAt so chat list shows latest
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    const populated = await message.populate({
      path: 'sender',
      select: 'fullName email'
    });

    res.status(200).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all messages of a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // ✅ oldest first
      .populate('sender', 'fullName email');

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
