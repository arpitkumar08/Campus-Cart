const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    // ✅ change from String to ObjectId reference
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
  },
  { timestamps: true } // ✅ createdAt & updatedAt
);

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
