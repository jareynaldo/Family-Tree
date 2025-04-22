'use client';

function computeGenerations(members) {
  if (!Array.isArray(members) || members.length === 0) return 0;

  const mapByName = new Map(members.map(m => [m.name, m]));
  let maxGen = 0;

  function dfs(name, depth, seen) {
    maxGen = Math.max(maxGen, depth);
    const member = mapByName.get(name);
    const children = member?.childrenNames || [];

    for (const child of children) {
      if (!seen.has(child)) {
        seen.add(child);
        dfs(child, depth + 1, seen);
      }
    }
  }

  for (const m of members) {
    dfs(m.name, 1, new Set([m.name]));
  }

  return maxGen;
}

export default function StatsCard({ members = [] }) {
  const total = Array.isArray(members) ? members.length : 0;
  const generations = total ? computeGenerations(members) : 0;

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
