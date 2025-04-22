'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useFamily } from '@/context/FamilyContext';
import { Tree }     from 'react-d3-tree';
import AddMemberForm from '@/components/AddMemberForm';
import EditMembersModal  from '@/components/EditMembersModal';

export default function FamilyTreePage() {
  const { members, loading, refresh } = useFamily();
  const [showForm, setShowForm]       = useState(false);
  const [showEdit, setShowEdit] = useState(false);


  // center the tree in its container
  const containerRef              = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 50 });
  useEffect(() => {
    if (!containerRef.current) return;
    const { offsetWidth } = containerRef.current;
    setTranslate({ x: offsetWidth / 2, y: 50 });
  }, []);

  // lookup by name for O(1) finds
  const byName = useMemo(
    () => new Map(members.map(m => [m.name, m])),
    [members]
  );

  // find all “roots” (anyone who isn’t listed as someone’s child)
  const roots = useMemo(() => {
    const childSet = new Set();
    members.forEach(m =>
      (m.childrenNames || []).forEach(c => childSet.add(c))
    );
    return members.filter(m => !childSet.has(m.name));
  }, [members]);

  // recursive builder:
  function buildNode(person) {
    // find spouse if any
    const spouse = person.spouseName && byName.get(person.spouseName);

    // combine children from both partners
    const kids = new Set([
      ...(person.childrenNames || []),
      ...(spouse?.childrenNames || []),
    ]);

    // build attribute object: include both names & occupations
    const attributes = spouse
      ? {
          // separate keys so they show on their own line
          [`Birth (${person.name})`]:    person.birthDate,
          [`Birth (${spouse.name})`]:    spouse.birthDate,
          [`Occ (${person.name})`]:      person.occupation,
          [`Occ (${spouse.name})`]:      spouse.occupation,
          Location:                      person.location,
        }
      : {
          Birth:      person.birthDate,
          Occ:        person.occupation,
          Location:   person.location,
        };

    return {
      name:     spouse ? `${person.name} & ${spouse.name}` : person.name,
      attributes,
      children: Array.from(kids)
        .map(childName => byName.get(childName))
        .filter(Boolean)
        .map(child => buildNode(child)),
    };
  }

  if (loading)       return <div className="p-8 text-center">Loading…</div>;
  if (!members.length) return <div className="p-8 text-center">No members.</div>;

  // build a forest (in case you have multiple root couples)
  const treeData = roots.map(root => buildNode(root));

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto space-y-12">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Family Tree</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add Member
          </button>
          <button
           onClick={() => setShowEdit(true)}
           className="btn-secondary"
         >
           Edit Members
         </button>
          <Link href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* tree */}
      <div
        ref={containerRef}
        className="w-full h-[700px] border rounded-lg bg-white"
      >
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc="step"
          // bump these up for more breathing room
          nodeSize={{ x: 250, y: 200 }}
          separation={{ siblings: 2, nonSiblings: 3 }}
          styles={{
            nodes: {
              node: { circle: { stroke: '#333', strokeWidth: 2 } },
              leafNode: { /* optional leaf styling */ },
            },
          }}
        />
      </div>

      {/* add‐member modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AddMemberForm
            onClose={() => {
              setShowForm(false);
              refresh();
            }}
          />
        </div>
      )}
      {/* Edit Members Modal */}
     {showEdit && (
       <div className="fixed inset-0 …">
         <EditMembersModal
           members={members}
           onClose={() => {
             setShowEdit(false);
             refresh();
           }}
         />
       </div>
     )}
    </div>
  );
}
