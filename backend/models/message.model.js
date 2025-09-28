// models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String },
    image: { type: String }, // single image support
    // Optional features:
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // read receipts
    attachments: [{ type: String }] // if you add more than one file/image later
  },
  { timestamps: true } // createdAt = send time
);

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;
