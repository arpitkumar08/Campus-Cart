const mongoose = require('mongoose');

// No changes were needed in your Mongoose model. It is well-defined.
const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who reported
  reason: { type: String, required: true },
  details: { type: String }, // optional longer text
  reportedType: { type: String, enum: ['Product', 'User'], required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // when reportedType === 'User'
  reportedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // when Product
  status: { type: String, enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  adminNote: { type: String }
});

module.exports = mongoose.model('Report', ReportSchema);
