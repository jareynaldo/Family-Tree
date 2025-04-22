'use client';

import { useState } from 'react';
import { useFamily } from '@/context/FamilyContext';

export default function AddMemberForm({ onClose }) {
  const { addMember } = useFamily();
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    spouseId: '',
    childrenIds: [],
    location: '',
    occupation: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChildrenChange = (e) => {
    setForm(prev => ({
      ...prev,
      childrenIds: e.target.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addMember(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      {error && <div className="text-red-600">{error}</div>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        onChange={handleChange}
        className="input-field"
      />

      <input
        type="date"
        name="birthDate"
        placeholder="Birth Date"
        required
        onChange={handleChange}
        className="input-field"
      />

      <input
        type="text"
        name="spouseId"
        placeholder="Spouse ID (optional)"
        onChange={handleChange}
        className="input-field"
      />

      <input
        type="text"
        name="childrenIds"
        placeholder="Children IDs (comma‑separated)"
        onChange={handleChildrenChange}
        className="input-field"
      />

      <input
        type="text"
        name="location"
        placeholder="Location (optional)"
        onChange={handleChange}
        className="input-field"
      />

      <input
        type="text"
        name="occupation"
        placeholder="Occupation (optional)"
        onChange={handleChange}
        className="input-field"
      />

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Member
        </button>
      </div>
    </form>
  );
}
