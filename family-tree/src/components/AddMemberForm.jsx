'use client';

import { useState } from 'react';
import { useFamily } from '@/context/FamilyContext';

export default function AddMemberForm({ onClose }) {
  const { addMember } = useFamily();
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    spouseName: '',
    childrenRaw: '',      // comma‑separated names
    location: '',
    occupation: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // turn comma‑string into array of trimmed child names
    const childrenNames = form.childrenRaw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    try {
      await addMember({
        name: form.name,
        birthDate: form.birthDate,
        spouseName: form.spouseName || null,
        childrenNames,
        location: form.location,
        occupation: form.occupation,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member');
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name:
        </label>
        <input
          id="name"
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
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          Birth Date:
        </label>
        <input
          id="birthDate"
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
        <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700">
          Spouse Name (optional):
        </label>
        <input
          id="spouseName"
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
        <label htmlFor="childrenRaw" className="block text-sm font-medium text-gray-700">
          Children Names (comma‑separated):
        </label>
        <input
          id="childrenRaw"
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
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location (optional):
        </label>
        <input
          id="location"
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
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
          Occupation (optional):
        </label>
        <input
          id="occupation"
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
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Member
        </button>
      </div>
    </form>
  );
}
