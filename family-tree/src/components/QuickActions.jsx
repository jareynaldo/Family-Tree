'use client';
import Link from 'next/link';

export default function QuickActions({ onAdd, onEdit, onViewTree }) {
  return (
    <div className="flex gap-4">
      <button onClick={onAdd} className="btn-primary">
        Add Member
      </button>
      <button onClick={onEdit} className="btn-secondary">
        Edit Members
      </button>
      <button onClick={onViewTree} className="btn-secondary">
        View Tree
      </button>
    </div>
  );
}