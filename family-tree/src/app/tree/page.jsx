'use client';
import { useFamily } from '@/context/FamilyContext';
import { Tree } from 'react-d3-tree';

export default function TreePage() {
  const { members, loading } = useFamily();

  // Find root member (not listed as anyone's child)
  const findRootMember = () => {
    const childNames = new Set();
    members.forEach(m => (m.childrenNames || []).forEach(c => childNames.add(c)));
    return members.find(m => !childNames.has(m.name)) || members[0];
  };

  // Convert flat array to hierarchical structure
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

  if (loading) return <div className="p-8 text-center">Loading family tree...</div>;
  if (!members.length) return <div className="p-8 text-center">No family members found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Family Tree</h1>
      <div className="w-full h-[600px] border rounded-lg bg-white">
        <Tree
          data={[buildTreeData(findRootMember())]}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: 300, y: 50 }}
        />
      </div>
    </div>
  );
}
