import { Header } from '../components/Header';

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto p-4 space-y-3 text-sm text-slate-200">
        <h1 className="text-xl font-semibold">About Voidspire Planner</h1>
        <p>Voidspire Planner is an original raid strategy planning app inspired by the workflow of modern raid planners.</p>
        <p>It supports encounter backgrounds, draw tools, multi-step strategy authoring, and shareable/read-only plans with local-first persistence.</p>
      </main>
    </div>
  );
}
