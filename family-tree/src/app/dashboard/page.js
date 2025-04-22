'use client';

import { useState } from 'react';
import { useFamily }  from '@/context/FamilyContext';
import StatsCard       from '@/components/StatsCard';
import RecentActivity  from '@/components/RecentActivity';
import QuickActions    from '@/components/QuickActions';
import AddMemberForm   from '@/components/AddMemberForm';

export default function Dashboard() {
  const { members, loading, refresh, addMember } = useFamily();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <p className="p-8 text-center">Loading…</p>;

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <QuickActions
          onAdd={() => setShowForm(true)}
          onViewTree={() => window.location.href = '/tree'}
        />
      </div>

      {/* Stats + Activity */}
      <StatsCard members={members} />
      <RecentActivity members={members} />

      {/* Modal Add Member */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AddMemberForm
            onClose={() => {
              setShowForm(false);
              refresh();
            }}
          />
        </div>
      )}
    </div>
  );
}
