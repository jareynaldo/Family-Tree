// src/components/AddMemberForm.jsx
'use client';

import { useState } from 'react';
import { useFamily } from '@/context/FamilyContext';

export default function AddMemberForm({ onClose }) {
  const { addMember } = useFamily();
  const [form, setForm] = useState({
    name:        '',
    birthDate:   '',
    spouseName:  '',
    childrenRaw: '',
    location:    '',
    occupation:  '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const childrenNames = form.childrenRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      await addMember({
        name:         form.name,
        birthDate:    form.birthDate,
        spouseName:   form.spouseName || null,
        childrenNames,
        location:     form.location,
        occupation:   form.occupation,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
    >
      {error && <div className="text-red-600">{error}</div>}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          name="name"
          type="text"
          required
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth Date:
        </label>
        <input
          name="birthDate"
          type="date"
          required
          value={form.birthDate}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Spouse Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Spouse Name (optional):
        </label>
        <input
          name="spouseName"
          type="text"
          placeholder="Jane Doe"
          value={form.spouseName}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Children Names */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Children Names (comma‑separated):
        </label>
        <input
          name="childrenRaw"
          type="text"
          placeholder="Alice Doe, Bob Doe"
          value={form.childrenRaw}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location (optional):
        </label>
        <input
          name="location"
          type="text"
          placeholder="San Francisco, CA"
          value={form.location}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Occupation (optional):
        </label>
        <input
          name="occupation"
          type="text"
          placeholder="Software Engineer"
          value={form.occupation}
          onChange={handleChange}
          className="input-field mt-1"
        />
      </div>

      {/* Actions */}
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
