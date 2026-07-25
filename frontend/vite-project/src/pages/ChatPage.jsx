import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';
import VoiceButton from '../components/VoiceButton';
import EmergencyModal from '../components/EmergencyModal';
import AudioPlayer from '../components/AudioPlayer';
import api from '../services/api';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [audioBase64, setAudioBase64] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setAudioBase64(null);

    try {
      const { data } = await api.post('/api/chat', { message: trimmed, sessionId });
      setSessionId(data.sessionId);

      const assistantMsg = {
        role: 'assistant',
        content: data.reply,
        riskLevel: data.riskLevel,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.audioBase64) setAudioBase64(data.audioBase64);

      if (data.emergencyScript && ['high', 'emergency'].includes(data.riskLevel)) {
        setEmergency(data.emergencyScript);
        setEmergencyContacts(data.emergencyContacts || []);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon">🧠</div>
            <h2>Hi, I'm RecoverAI</h2>
            <p>I'm here to support your recovery journey. Speak freely — voice or text, whatever feels right.</p>
          </div>
        )}
        <div className="messages-list">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && (
            <div className="message-row assistant">
              <div className="message-bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <VoiceButton onTranscript={(t) => sendMessage(t)} disabled={loading} />
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message or press the mic to speak…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
      <AudioPlayer audioBase64={audioBase64} />
      <EmergencyModal script={emergency} contacts={emergencyContacts} onClose={() => setEmergency(null)} />
    </div>
  );
};

export default ChatPage;
