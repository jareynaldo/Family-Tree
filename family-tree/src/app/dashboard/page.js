'use client';

import { useState } from 'react';
import { useFamily }  from '@/context/FamilyContext';  // you’ll need this later
import StatsCard      from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';
import QuickActions   from '@/components/QuickActions';
import AddMemberForm  from '@/components/AddMemberForm';



export default function Dashboard() {
  const { members, loading, refresh } = useFamily();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <p className="p-8">Loading…</p>;

  return (
    <div className="p-8">
      <StatsCard members={members} />

      <QuickActions
        onAdd={() => setShowForm(true)}
        onViewTree={() => window.location.href = '/tree'} 
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AddMemberForm
            onClose={() => { setShowForm(false); refresh(); }}
          />
        </div>
      )}

      <RecentActivity members={members} />
    </div>
  );
}