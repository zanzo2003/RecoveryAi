import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './JournalPage.css';

const MOODS = ['great', 'good', 'okay', 'struggling', 'crisis'];
const MOOD_EMOJI = { great: '😊', good: '🙂', okay: '😐', struggling: '😟', crisis: '😰' };

const JournalPage = () => {
  const [journals, setJournals] = useState([]);
  const [form, setForm] = useState({ content: '', mood: 'okay' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tip, setTip] = useState('');
  const [tipLoading, setTipLoading] = useState(false);
  const [tipError, setTipError] = useState('');

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/journal');
      setJournals(data);
    } catch {
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJournals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/journal', form);
      setJournals([data, ...journals]);
      setForm({ content: '', mood: 'okay' });
    } catch {
      setError('Failed to save journal entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetTip = async () => {
    setTipLoading(true);
    setTipError('');
    setTip('');
    try {
      const { data } = await api.get('/api/journal/tip');
      setTip(data.tip);
    } catch {
      setTipError('Failed to get a tip. Please try again.');
    } finally {
      setTipLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="journal-page">
      <Navbar />
      <div className="journal-container">
        <div className="journal-header">
          <h1 className="journal-title">📔 Recovery Journal</h1>
          <button className="tip-btn" onClick={handleGetTip} disabled={tipLoading}>
            {tipLoading ? 'Thinking…' : '💡 Get a Tip'}
          </button>
        </div>

        {tipError && <div className="tip-error">{tipError}</div>}
        {tip && (
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <p className="tip-text">{tip}</p>
          </div>
        )}

        <form className="journal-form" onSubmit={handleSubmit}>
          <label className="form-label">How are you feeling?</label>
          <div className="mood-selector">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                className={`mood-btn ${form.mood === m ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, mood: m })}
              >
                {MOOD_EMOJI[m]} {m}
              </button>
            ))}
          </div>

          <label className="form-label">What's on your mind?</label>
          <textarea
            className="journal-textarea"
            placeholder="Write freely — this is your space…"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4}
          />

          {error && <div className="journal-error">{error}</div>}

          <button type="submit" className="journal-submit" disabled={submitting || !form.content.trim()}>
            {submitting ? 'Saving…' : 'Save Entry'}
          </button>
        </form>

        <div className="journal-list">
          <h2 className="list-title">Past Entries</h2>
          {loading && <p className="journal-empty">Loading…</p>}
          {!loading && journals.length === 0 && (
            <p className="journal-empty">No entries yet. Write your first one above.</p>
          )}
          {journals.map((j) => (
            <div key={j._id} className="journal-card">
              <div className="journal-card-header">
                <span className="journal-mood">{MOOD_EMOJI[j.mood]} {j.mood}</span>
                <span className="journal-date">{formatDate(j.createdAt)}</span>
              </div>
              <p className="journal-card-content">{j.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
