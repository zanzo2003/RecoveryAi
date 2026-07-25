import { useState } from 'react';
import api from '../services/api';
import './EmergencyContactsList.css';

const EmergencyContactsList = ({ contacts, onContactsUpdated, onAddClick }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (contactId) => {
    setDeleting(contactId);
    try {
      const { data } = await api.delete(`/api/emergency-contacts/${contactId}`);
      onContactsUpdated(data.contacts);
    } catch {
      alert('Failed to delete contact');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="ec-list">
      {contacts.length === 0 ? (
        <div className="ec-empty-state">
          <p className="ec-empty-text">No emergency contacts added yet</p>
          <button className="ec-add-btn" onClick={onAddClick}>
            + Add Contact
          </button>
        </div>
      ) : (
        <>
          {contacts.map((contact) => (
            <div key={contact._id} className="ec-item">
              <div className="ec-info">
                <div className="ec-name">{contact.name}</div>
                <div className="ec-detail">
                  <span className="ec-relation">{contact.relation}</span>
                  <span className="ec-phone">{contact.phone}</span>
                </div>
              </div>
              <button
                className="ec-delete"
                onClick={() => handleDelete(contact._id)}
                disabled={deleting === contact._id}
                title="Delete contact"
              >
                ✕
              </button>
            </div>
          ))}
          <button className="ec-add-more-btn" onClick={onAddClick}>
            + Add Another Contact
          </button>
        </>
      )}
    </div>
  );
};

export default EmergencyContactsList;
