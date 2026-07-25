const Journal = require('../models/Journal');
const { openai } = require('../services/openai.service');

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

const getTip = async (req, res) => {
  try {
    const recentJournals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    const journalSummary = recentJournals.length
      ? recentJournals.map((j) => `- [${j.mood}] ${j.content}`).join('\n')
      : 'No journal entries yet.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate recovery coach for someone with a Substance Use Disorder.
Based on their recent journal entries, give ONE short, personalized, actionable tip (2-3 sentences) to help them control urges or improve recovery.
Be warm, specific to what they wrote, and never judgmental.`,
        },
        {
          role: 'user',
          content: `Recent journal entries:\n${journalSummary}`,
        },
      ],
    });

    res.json({ tip: completion.choices[0].message.content });
  } catch (err) {
    console.error('Get tip error:', err);
    res.status(500).json({ message: 'Failed to generate tip' });
  }
};

module.exports = { getJournals, createJournal, getTip };
