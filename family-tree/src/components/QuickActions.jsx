'use client';
import Link from 'next/link';

export default function QuickActions({ onAdd }) {
  return (
    <div className="flex gap-4">
      <button onClick={onAdd} className="btn-primary">
        Add Member
      </button>
      <Link href="/tree" className="btn-secondary">
        View Tree
      </Link>
    </div>
  );
}