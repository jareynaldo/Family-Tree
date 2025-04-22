'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useFamily } from '@/context/FamilyContext';
import { Tree } from 'react-d3-tree';
import AddMemberForm from '@/components/AddMemberForm';

export default function TreePage() {
  const { members, loading, refresh } = useFamily();
  const [showForm, setShowForm] = useState(false);
  
  // Tree rendering logic...
  const buildTreeData = (member) => ({
    name: member.name,
    attributes: {
      Birth: member.birthDate,
      Location: member.location,
      Occupation: member.occupation
    },
    children: (member.childrenNames || [])
      .map(name => members.find(m => m.name === name))
      .filter(Boolean)
      .map(buildTreeData)
  });
  
  // Find root member logic...
  const findRootMember = () => {
    const childNames = new Set();
    members.forEach(m => (m.childrenNames || []).forEach(c => childNames.add(c)));
    return members.find(m => !childNames.has(m.name)) || members[0];
  };

  if (loading) return <div className="p-8 text-center">Loading family tree...</div>;
  if (!members.length) return <div className="p-8 text-center">No family members found.</div>;

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto space-y-12">
      {/* Header with quick actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Family Tree</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowForm(true)} 
            className="btn-primary"
          >
            Add Member
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="w-full h-[600px] border rounded-lg bg-white">
        <Tree
          data={[buildTreeData(findRootMember())]}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: 300, y: 50 }}
        />
      </div>

      {/* Modal Add Member - reused from dashboard */}
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
