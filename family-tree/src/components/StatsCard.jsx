'use client';

function calcAge(birthDate) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000*60*60*24*365));
}

// Depth‑first search to compute max generation depth
function computeGenerations(members) {
  const map = new Map(members.map(m => [m.id, m]));
  let maxGen = 0;

  function dfs(id, depth, seen) {
    maxGen = Math.max(maxGen, depth);
    const member = map.get(id);
    for (const childId of member.childrenIds) {
      if (!seen.has(childId)) {
        seen.add(childId);
        dfs(childId, depth + 1, seen);
      }
    }
  }

  members.forEach(m => dfs(m.id, 1, new Set([m.id])));
  return maxGen;
}

export default function StatsCard({ members }) {
  const total = members.length;
  const generations = members.length ? computeGenerations(members) : 0;

  return (
    <div className="card mb-6">
      <h2 className="section-title">Your Family at a Glance</h2>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-4xl font-bold">{total}</p>
          <p>Total Members</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{generations}</p>
          <p>Generations</p>
        </div>
      </div>
    </div>
  );
}
