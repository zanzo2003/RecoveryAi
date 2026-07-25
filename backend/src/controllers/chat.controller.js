const Session = require('../models/Session');
const recoveryAgent = require('../agents/recovery.agent');
const { tts } = require('../services/openai.service');
const riskTool = require('../tools/risk.tool');

const chat = async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user.id;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Fetch or create session
    let session;
    if (sessionId) {
      session = await Session.findOne({ _id: sessionId, userId });
    }
    if (!session) {
      session = await Session.create({ userId, messages: [], riskHistory: [] });
    }

    // Append user message
    session.messages.push({ role: 'user', content: message });

    // Build conversation history for the agent (last 20 messages for context window)
    const history = session.messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Run recovery agent
    const { response, emergencyScript } = await recoveryAgent.run(history, userId);

    // Always assess risk for this conversation
    const conversationSummary = session.messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');
    const riskAssessmentResult = await riskTool.execute({ args: { conversation_summary: conversationSummary } });
    let riskLevel = 'low';
    try {
      const parsed = JSON.parse(riskAssessmentResult);
      riskLevel = parsed.level || 'low';
    } catch {
      // default to low on parse error
    }

    // Persist assistant reply
    session.messages.push({ role: 'assistant', content: response, riskLevel });

    // Track all risk levels in history
    session.riskHistory.push({ level: riskLevel });

    await session.save();

    // Generate TTS audio
    let audioBase64 = null;
    try {
      audioBase64 = await tts(response);
    } catch {
      // TTS is non-critical; continue without audio
    }

    // Include emergency contacts if high/emergency risk detected
    let emergencyContacts = [];
    if (['high', 'emergency'].includes(riskLevel)) {
      const User = require('../models/User');
      const user = await User.findById(userId).select('emergencyContacts');
      emergencyContacts = user?.emergencyContacts || [];
    }

    res.json({
      reply: response,
      riskLevel,
      emergencyScript,
      emergencyContacts,
      audioBase64,
      sessionId: session._id,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Failed to process message' });
  }
};

const getSessions = async (req, res) => {
  const userId = req.user.id;
  try {
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .select('createdAt');
    res.json({
      sessions: sessions.map((s) => ({ id: s._id, createdAt: s.createdAt })),
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

const getSession = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  try {
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ sessionId: session._id, messages: session.messages });
  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
};

module.exports = { chat, getSessions, getSession };
