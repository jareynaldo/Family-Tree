'use client';

import { useState, useEffect } from 'react';
import { useFamily }            from '@/context/FamilyContext';

export default function EditMembersModal({ members = [], onClose }) {
  const { updateFamilyMember } = useFamily();

  // 1) track which member is selected
  const [selectedId, setSelectedId] = useState(members[0]?.id || '');

  // 2) form state
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    spouseName: '',
    childrenRaw: '',
    location: '',
    occupation: '',
  });

  // 3) when selectedId or members list changes, re‑populate form
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

  // 4) handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // 5) submit updated member
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      name:         form.name,
      birthDate:    form.birthDate,
      spouseName:   form.spouseName || null,
      childrenNames: form.childrenRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      location:     form.location,
      occupation:   form.occupation,
    };
    await updateFamilyMember(selectedId, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Edit a Family Member</h2>

        {/* Select which member to edit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select member
          </label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full input-field"
            required
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Birth Date</label>
          <input
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            className="mt-1 w-full input-field"
            required
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
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
