const Journal = require('../models/Journal');

const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(journals);
  } catch {
    res.status(500).json({ message: 'Failed to fetch journals' });
  }
};

const createJournal = async (req, res) => {
  const { content, mood } = req.body;
  if (!content || !mood) {
    return res.status(400).json({ message: 'Content and mood are required' });
  }
  try {
    const journal = await Journal.create({ userId: req.user.id, content, mood });
    res.status(201).json(journal);
  } catch {
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

module.exports = { getJournals, createJournal };
