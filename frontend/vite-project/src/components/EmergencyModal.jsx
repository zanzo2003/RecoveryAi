import './EmergencyModal.css';

const EmergencyModal = ({ script, contacts, onClose }) => {
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

        <div className="modal-contacts">
          <h3>Call for Help</h3>
          <a href="tel:988" className="crisis-btn primary">📞 Call 988 Crisis Line</a>
          {contacts && contacts.length > 0 && (
            <>
              <p className="contacts-divider">Or reach out to someone you trust:</p>
              {contacts.map((contact) => (
                <a
                  key={contact._id}
                  href={`tel:${contact.phone}`}
                  className="contact-btn"
                  title={`${contact.name} (${contact.relation})`}
                >
                  👤 {contact.name} ({contact.relation})
                </a>
              ))}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">I'm okay, close this</button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
