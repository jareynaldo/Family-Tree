'use client';
import { useState } from 'react';
import { useFamily }  from '@/context/FamilyContext';
import StatsCard       from '@/components/StatsCard';
import RecentActivity  from '@/components/RecentActivity';
import QuickActions    from '@/components/QuickActions';
import AddMemberForm   from '@/components/AddMemberForm';

export default function Dashboard() {
  const { members, loading, refresh } = useFamily();
  const [openForm, setOpenForm] = useState(false);

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-text">Dashboard</h2>
        <QuickActions
          onAdd={() => setOpenForm(true)}
          onViewTree={() => window.location.href = "/tree"}
        />
      </div>

      <StatsCard members={members} />
      <RecentActivity members={members} />

      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AddMemberForm
            onClose={() => {
              setOpenForm(false);
              refresh();
            }}
          />
        </div>
      )}
    </>
  );
}
