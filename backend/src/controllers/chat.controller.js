const Session = require('../models/Session');
const recoveryAgent = require('../agents/recovery.agent');
const { tts } = require('../services/openai.service');

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
    const { response, riskLevel, emergencyScript } = await recoveryAgent.run(history, userId);

    // Persist assistant reply
    session.messages.push({ role: 'assistant', content: response, riskLevel });

    // Track risk history on medium/high/emergency
    if (['medium', 'high', 'emergency'].includes(riskLevel)) {
      session.riskHistory.push({ level: riskLevel });
    }

    await session.save();

    // Generate TTS audio
    let audioBase64 = null;
    try {
      audioBase64 = await tts(response);
    } catch {
      // TTS is non-critical; continue without audio
    }

    res.json({
      reply: response,
      riskLevel,
      emergencyScript,
      audioBase64,
      sessionId: session._id,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Failed to process message' });
  }
};

module.exports = { chat };
