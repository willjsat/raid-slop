import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="h-12 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between px-4">
      <Link to="/" className="font-semibold text-sky-300">Voidspire Planner</Link>
      <div className="text-xs flex gap-3 text-slate-300">
        <Link to="/" className="hover:text-white">Bosses</Link>
        <Link to="/about" className="hover:text-white">About</Link>
      </div>
    </header>
  );
}
