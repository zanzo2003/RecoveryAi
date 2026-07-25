import { useState } from 'react';
import api from '../services/api';
import './AddEmergencyContactModal.css';

const AddEmergencyContactModal = ({ isOpen, onClose, onContactAdded }) => {
  const [form, setForm] = useState({ name: '', phone: '', relation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.relation) {
      setError('All fields required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/emergency-contacts', form);
      setForm({ name: '', phone: '', relation: '' });
      onContactAdded(data.contacts);
      onClose();
    } catch {
      setError('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ec" onClick={onClose}>
      <div className="modal-box-ec" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-ec">
          <h2>Add Emergency Contact</h2>
          <button className="modal-close-ec" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-ec">
          {error && <p className="form-error-ec">{error}</p>}

          <div className="form-group-ec">
            <label>Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group-ec">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group-ec">
            <label>Relation</label>
            <input
              type="text"
              placeholder="e.g., Sister, Therapist, Friend"
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="modal-footer-ec">
            <button type="button" className="btn-cancel-ec" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit-ec" disabled={loading}>
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmergencyContactModal;
