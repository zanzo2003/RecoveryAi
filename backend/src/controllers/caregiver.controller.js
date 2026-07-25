const Session = require('../models/Session');
const Journal = require('../models/Journal');

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

module.exports = { getSummary };
