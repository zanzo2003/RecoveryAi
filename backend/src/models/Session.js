const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: null },
  timestamp: { type: Date, default: Date.now },
});

const riskEntrySchema = new mongoose.Schema({
  level: { type: String, enum: ['low', 'medium', 'high', 'emergency'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
  riskHistory: [riskEntrySchema],
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
