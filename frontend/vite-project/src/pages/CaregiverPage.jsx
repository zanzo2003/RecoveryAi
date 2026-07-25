import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import AddEmergencyContactModal from '../components/AddEmergencyContactModal';
import EmergencyContactsList from '../components/EmergencyContactsList';
import RecoveryReportModal from '../components/RecoveryReportModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './CaregiverPage.css';

const CaregiverPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [summaryRes, contactsRes] = await Promise.all([
          api.get('/api/caregiver/summary'),
          api.get('/api/emergency-contacts'),
        ]);
        setSummary(summaryRes.data);
        setContacts(contactsRes.data.contacts);
      } catch {
        setError('Failed to load caregiver summary');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="caregiver-page">
      <Navbar />
      <div className="caregiver-container">
        <div className="caregiver-header">
          <div>
            <h1 className="caregiver-title">👨‍👩‍👧 Caregiver View</h1>
            <p className="caregiver-subtitle">Recovery overview for <strong>{user?.name}</strong></p>
          </div>
          <button className="cg-report-btn" onClick={() => setIsReportOpen(true)}>
            📋 Generate Recovery Report
          </button>
        </div>

        {loading && <p className="cg-loading">Loading…</p>}
        {error && <p className="cg-error">{error}</p>}

        {summary && (
          <>
            <div className="cg-stats">
              <div className="cg-stat-card">
                <div className="stat-number">{summary.recentSessions.length}</div>
                <div className="stat-label">Sessions</div>
              </div>
              <div className="cg-stat-card">
                <div className="stat-number">{summary.journalCount}</div>
                <div className="stat-label">Journals</div>
              </div>
              <div className="cg-stat-card">
                <div className="stat-number">{summary.riskHistory.length}</div>
                <div className="stat-label">Risk Events</div>
              </div>
            </div>

            <div className="cg-dashboard">
              <section className="cg-section">
                <h2 className="cg-section-title">Recent Sessions</h2>
                {summary.recentSessions.length === 0 && (
                  <p className="cg-empty">No sessions yet.</p>
                )}
                {summary.recentSessions.slice(0, 4).map((s) => (
                  <div key={s.id} className="cg-session-card">
                    <div className="cg-session-info">
                      <span className="cg-session-date">{formatDate(s.createdAt)}</span>
                      <span className="cg-session-msgs">{s.messageCount} msgs</span>
                    </div>
                    <RiskBadge level={s.latestRisk} />
                  </div>
                ))}
              </section>

              <section className="cg-section">
                <h2 className="cg-section-title">🚨 Emergency Contacts</h2>
                <EmergencyContactsList
                  contacts={contacts}
                  onContactsUpdated={setContacts}
                  onAddClick={() => setIsModalOpen(true)}
                />
              </section>

              <section className="cg-section">
                <h2 className="cg-section-title">Risk History</h2>
                {summary.riskHistory.length === 0 && (
                  <p className="cg-empty">No risk events recorded.</p>
                )}
                <div className="cg-risk-timeline">
                  {summary.riskHistory.slice(0, 6).map((r, i) => (
                    <div key={i} className="cg-risk-entry">
                      <RiskBadge level={r.level} />
                      <span className="cg-risk-time">{formatDate(r.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
        <AddEmergencyContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContactAdded={setContacts}
        />
        <RecoveryReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      </div>
    </div>
  );
};

export default CaregiverPage;
