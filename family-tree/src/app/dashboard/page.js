'use client';

import { useEffect, useState } from 'react';
import { useRouter }            from 'next/navigation';
import { useAuth }              from '@/context/AuthContext';
import { useFamily }            from '@/context/FamilyContext';

import Navbar                   from '@/components/Navbar';
import QuickActions             from '@/components/QuickActions';
import StatsCard                from '@/components/StatsCard';
import RecentActivity           from '@/components/RecentActivity';
import AddMemberForm            from '@/components/AddMemberForm';
import EditMembersModal         from '@/components/EditMembersModal';




export default function Dashboard() {
  // ─── 1) Auth & Data Hooks ───────────────────────────────────────
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { members, loading: famLoading, refresh, addMember } = useFamily();

  // ─── 2) Local UI State ─────────────────────────────────────────
  const [showAdd, setShowAdd]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  

  // ─── 3) Redirect if not logged in ──────────────────────────────
  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/login');
    }
  }, [authLoading, token, router]);

  // ─── 4) Early returns ──────────────────────────────────────────
  if (authLoading || !token) {
    return <p className="p-8 text-center">Checking credentials…</p>;
  }
  if (famLoading) {
    return <p className="p-8 text-center">Loading your family…</p>;
  }

  return (
    <div className="min-h-screen bg-blue-50">

      <div className="container mx-auto px-8 py-6 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <QuickActions
            onAdd={() => setShowAdd(true)}
            onEdit={() => setShowEdit(true)}
            onViewTree={() => router.push('/tree')}
          />
        </header>

        {/* Stats + Activity */}
        <StatsCard members={members} />
        <RecentActivity members={members} />

        {/* Add Member Modal */}
        {showAdd && (
          <AddMemberForm
            onClose={() => {
              setShowAdd(false);
              refresh();
            }}
          />
        )}

        {/* Edit Members Modal */}
        {showEdit && (
          <EditMembersModal
            members={members}
            onClose={() => {
              setShowEdit(false);
              refresh();
            }}
          />
        )}
      </div>
    </div>
  );
}
