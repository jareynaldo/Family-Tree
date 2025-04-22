'use client';
import { useState } from 'react';

export default function EditMemberForm({ member, onSave, onCancel }) {
  // seed with the currently‑selected member
  const [form, setForm] = useState({
    name: member.name,
    birthDate: member.birthDate,
    spouseName: member.spouseName || '',
    childrenRaw: (member.childrenNames || []).join(', '),
    location: member.location || '',
    occupation: member.occupation || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const childrenNames = form.childrenRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    onSave({
      name: form.name,
      birthDate: form.birthDate,
      spouseName: form.spouseName || null,
      childrenNames,
      location: form.location,
      occupation: form.occupation,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Spouse */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Spouse Name
        </label>
        <input
          name="spouseName"
          value={form.spouseName}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Children */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Children (comma‑separated)
        </label>
        <input
          name="childrenRaw"
          value={form.childrenRaw}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Occupation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Occupation
        </label>
        <input
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="mt-1 w-full input-field"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}
