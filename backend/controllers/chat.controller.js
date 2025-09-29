const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const mongoose = require('mongoose');

/**
 * 🔹 Create or Get Conversation
 */
exports.createConversation = async (req, res) => {
  try {
    const { senderId, receiverId, product } = req.body;
    console.log("📩 [createConversation] Incoming Body =>", req.body);

    // Validate presence
    if (!senderId || !receiverId || !product) {
      return res.status(400).json({ error: "Missing senderId, receiverId, or product" });
    }

    // Validate ObjectIds
    const ids = [senderId, receiverId, product];
    if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid senderId, receiverId, or product" });
    }

    // Prevent self-chat
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ error: "Sender and receiver cannot be the same user" });
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      product
    });

    console.log("🔍 Existing conversation found? =>", !!conversation);

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        product
      });
      await conversation.save();
      console.log("✅ New conversation created =>", conversation._id);
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error("❌ [createConversation] Server Error =>", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔹 Get all conversations for a user
 */
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("📥 [getUserConversations] userId =>", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    })
      .sort({ updatedAt: -1 })
      .populate([
        { path: "participants", select: "fullName email" },
        { path: "product", select: "title images price" }
      ]);

    console.log("✅ Conversations found =>", conversations.length);
    conversations.forEach((c, i) => {
      console.log(
        `[${i}] convId:${c._id} product:${c.product?.title} participants:`,
        c.participants.map((p) => ({ id: p._id, name: p.fullName }))
      );
    });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("❌ [getUserConversations] Server Error =>", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔹 Send message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text, image } = req.body;

    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ error: "Missing conversationId, senderId or text" });
    }

    const message = new Message({
      conversationId,
      sender: senderId,
      text,
      image
    });

    await message.save();

    // ✅ Populate sender
    const populatedMsg = await message.populate({
      path: "sender",
      select: "fullName email"
    });

    // ✅ Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    // ✅ Emit to socket with populated sender
    if (req.io) {                        // if you attached io to req in server.js
      req.io.to(conversationId).emit("receive_message", populatedMsg);
    }

    res.status(200).json(populatedMsg);
  } catch (err) {
    console.error("❌ [sendMessage] Server Error =>", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔹 Get all messages of a conversation
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    console.log("📥 [getMessages] conversationId =>", conversationId);

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("sender", "fullName email");

    console.log(`✅ Messages found => ${messages.length}`);
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ [getMessages] Server Error =>", err);
    res.status(500).json({ error: err.message });
  }
};
