import { useState } from 'react';
import api from '../services/api';
import './EmergencyContactForm.css';

const EmergencyContactForm = ({ onContactsUpdated }) => {
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
      onContactsUpdated(data.contacts);
    } catch {
      setError('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ec-form" onSubmit={handleSubmit}>
      <h3>Add Emergency Contact</h3>
      {error && <p className="ec-error">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        disabled={loading}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Relation (e.g., Sister, Therapist)"
        value={form.relation}
        onChange={(e) => setForm({ ...form, relation: e.target.value })}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
};

export default EmergencyContactForm;
