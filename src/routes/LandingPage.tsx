import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { voidspireRaid } from '../data/bosses';
import { seededByBoss } from '../data/plans';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-semibold">{voidspireRaid.name} Heroic Planner</h1>
        <p className="text-sm text-slate-300">Choose an encounter to open the editable planner or a seeded read-only share view.</p>
        <div className="grid md:grid-cols-2 gap-3">{voidspireRaid.bosses.map((boss) => (
          <div key={boss.slug} className="panel p-3">
            <h2 className="font-semibold">{boss.name}</h2>
            <p className="text-xs text-slate-300 mb-3">{boss.description}</p>
            <div className="flex gap-2 text-xs">
              <Link className="btn" to={`/planner/${boss.slug}`}>Open Planner</Link>
              <Link className="btn" to={`/plan/${seededByBoss[boss.slug].id}`}>Read-only</Link>
            </div>
          </div>
        ))}</div>
      </main>
    </div>
  );
}
