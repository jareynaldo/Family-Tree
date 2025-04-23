'use client';

import { useState, useEffect } from 'react';
import { useFamily } from '@/context/FamilyContext';

export default function EditMembersModal({ members, onClose }) {
  const {
    updateFamilyMember,
    deleteFamilyMember
  } = useFamily();

  // which member is selected
  const [selectedId, setSelectedId] = useState(members[0]?.id);

  const [form, setForm] = useState({
    name:        '',
    birthDate:   '',
    spouseName:  '',
    childrenRaw: '',
    location:    '',
    occupation:  '',
  });

  useEffect(() => {
    const m = members.find(m => m.id === selectedId);
    if (!m) return;
    setForm({
      name:        m.name,
      birthDate:   m.birthDate,
      spouseName:  m.spouseName || '',
      childrenRaw: (m.childrenNames || []).join(', '),
      location:    m.location || '',
      occupation:  m.occupation || '',
    });
  }, [selectedId, members]);

  const handleSelect = e => setSelectedId(e.target.value);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const childrenNames = form.childrenRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    await updateFamilyMember(selectedId, {
      name:         form.name,
      birthDate:    form.birthDate,
      spouseName:   form.spouseName || null,
      childrenNames,
      location:     form.location,
      occupation:   form.occupation,
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    await deleteFamilyMember(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit a Family Member</h2>

        {/* select which member */}
        <label className="block mb-2 font-medium">Select member</label>
        <select
          value={selectedId}
          onChange={handleSelect}
          className="w-full mb-4 p-2 border rounded"
        >
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Name */}
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Birth Date */}
        <label className="block text-sm font-medium">Birth Date</label>
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Spouse Name */}
        <label className="block text-sm font-medium">Spouse Name</label>
        <input
          name="spouseName"
          value={form.spouseName}
          onChange={handleChange}
          placeholder="(optional)"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Children */}
        <label className="block text-sm font-medium">Children (comma‑separated)</label>
        <input
          name="childrenRaw"
          value={form.childrenRaw}
          onChange={handleChange}
          placeholder="e.g. Alice, Bob"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Location */}
        <label className="block text-sm font-medium">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="(optional)"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Occupation */}
        <label className="block text-sm font-medium">Occupation</label>
        <input
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          placeholder="(optional)"
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="btn-secondary px-4 py-2"
          >
            Delete
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
