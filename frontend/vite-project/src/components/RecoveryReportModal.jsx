import { useEffect, useState } from 'react';
import api from '../services/api';
import './RecoveryReportModal.css';

const RecoveryReportModal = ({ isOpen, onClose }) => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const generate = async () => {
      setLoading(true);
      setError('');
      setReport('');
      try {
        const { data } = await api.post('/api/caregiver/report');
        setReport(data.report);
      } catch {
        setError('Failed to generate report. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-rr" onClick={onClose}>
      <div className="modal-box-rr" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-rr">
          <h2>📋 Recovery Report</h2>
          <button className="modal-close-rr" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body-rr">
          {loading && <p className="rr-loading">Analyzing recent risk history and journal entries…</p>}
          {error && <p className="rr-error">{error}</p>}
          {!loading && report && <p className="rr-report-text">{report}</p>}
        </div>
      </div>
    </div>
  );
};

export default RecoveryReportModal;
