const Session = require('../models/Session');
const Journal = require('../models/Journal');
const { openai } = require('../services/openai.service');

const getSummary = async (req, res) => {
  const userId = req.user.id;
  try {
    const recentSessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt riskHistory messages');

    const journalCount = await Journal.countDocuments({ userId });

    // Flatten risk history across sessions for timeline (last 10 entries)
    const riskHistory = recentSessions
      .flatMap((s) => s.riskHistory)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({
      recentSessions: recentSessions.map((s) => ({
        id: s._id,
        createdAt: s.createdAt,
        messageCount: s.messages.length,
        latestRisk: s.riskHistory[s.riskHistory.length - 1]?.level || 'low',
      })),
      riskHistory,
      journalCount,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch caregiver summary' });
  }
};

const generateRecoveryReport = async (req, res) => {
  const userId = req.user.id;
  try {
    const recentSessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('riskHistory');

    const riskHistory = recentSessions
      .flatMap((s) => s.riskHistory)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    const recentJournals = await Journal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    if (riskHistory.length === 0 && recentJournals.length === 0) {
      return res.json({ report: 'Not enough data yet to generate a recovery report.' });
    }

    const riskSummary = riskHistory.length
      ? riskHistory.map((r) => `- ${r.level} risk on ${new Date(r.timestamp).toLocaleDateString()}`).join('\n')
      : 'No risk events recorded.';

    const journalSummary = recentJournals.length
      ? recentJournals.map((j) => `- [${j.mood}] ${j.content}`).join('\n')
      : 'No journal entries recorded.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a clinical assistant summarizing a Substance Use Disorder recovery patient's progress for their caregiver.
Given the recent relapse risk history and the last 3 journal entries, write a short, plain-language report (3-5 sentences) covering:
- Whether the person appears to be recovering well or is struggling
- Any concerning patterns (rising risk levels, negative moods)
- One suggestion for the caregiver

Be factual and non-alarmist. Do not diagnose.`,
        },
        {
          role: 'user',
          content: `Recent risk history:\n${riskSummary}\n\nRecent journal entries:\n${journalSummary}`,
        },
      ],
    });

    res.json({ report: completion.choices[0].message.content });
  } catch (err) {
    console.error('Generate recovery report error:', err);
    res.status(500).json({ message: 'Failed to generate recovery report' });
  }
};

module.exports = { getSummary, generateRecoveryReport };
