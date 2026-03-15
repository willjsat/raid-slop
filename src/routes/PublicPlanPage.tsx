import { useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { CanvasEditor } from '../features/planner/CanvasEditor';
import { StepPanel } from '../features/planner/StepPanel';
import { usePlannerStore } from '../store/plannerStore';
import { decodePlan } from '../lib/share';

export function PublicPlanPage() {
  const { planId = '' } = useParams();
  const [search] = useSearchParams();
  const load = usePlannerStore((s) => s.loadPlanById);
  const setCurrent = usePlannerStore((s) => s.setCurrentPlan);
  const setReadOnly = usePlannerStore((s) => s.setReadOnly);
  const plan = usePlannerStore((s) => s.currentPlan);

  useEffect(() => {
    const encoded = search.get('data');
    if (encoded) {
      try { setCurrent(decodePlan(encoded)); } catch { load(planId); }
    } else load(planId);
    setReadOnly(true);
    return () => setReadOnly(false);
  }, [load, planId, search, setCurrent, setReadOnly]);

  return <div className="h-screen flex flex-col"><Header /><div className="p-2 border-b border-slate-800 text-sm flex items-center gap-2"><span className="font-semibold">{plan?.name ?? 'Plan'}</span><Link className="btn" to={plan ? `/planner/${plan.bossSlug}` : '/'}>Make a copy</Link></div><div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden"><section className="col-span-9"><CanvasEditor readOnly /></section><aside className="panel col-span-3 p-2 overflow-auto"><StepPanel readOnly /></aside></div></div>;
}
