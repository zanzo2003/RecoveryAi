const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'struggling', 'crisis'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
