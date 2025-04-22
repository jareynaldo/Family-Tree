'use client';

import Link from 'next/link';

export default function QuickActions({ onAdd, onViewTree }) {
  return (
    <div className="flex gap-4 mb-6">
      <button onClick={onAdd} className="btn-primary">Add Member</button>
      <button onClick={onViewTree} className="btn-secondary">View Tree</button>
    </div>
  );
}