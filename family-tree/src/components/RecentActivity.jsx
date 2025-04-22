'use client';

function calcAge(birthDate) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
}

export default function RecentActivity({ members, limit = 5 }) {
  // guard: if members isn’t an array, fall back to []
  const arr = Array.isArray(members) ? members : [];

  // now safe to spread
  const recent = [...arr]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return (
    <div className="card mb-6">
      <h2 className="section-title">Recent Activity</h2>
      <ul className="space-y-2">
        {recent.map((m) => (
          <li key={m.id} className="flex justify-between">
            <span>Added {m.name}</span>
            <span className="text-sm text-gray-500">
              {calcAge(m.birthDate)} yrs
            </span>
          </li>
        ))}
        {recent.length === 0 && (
          <li className="text-gray-500">No activity yet.</li>
        )}
      </ul>
    </div>
  );
}
