import './EmergencyModal.css';

const EmergencyModal = ({ script, onClose }) => {
  if (!script) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Emergency Support">
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-icon">🚨</span>
          <h2>Emergency Support</h2>
        </div>
        <p className="modal-subtitle">You are not alone. Here are your next steps:</p>
        <div className="modal-content">
          <p>{script}</p>
        </div>
        <div className="modal-footer">
          <a href="tel:988" className="crisis-btn">📞 Call 988 Crisis Line</a>
          <button onClick={onClose} className="close-btn">I'm okay, close this</button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
