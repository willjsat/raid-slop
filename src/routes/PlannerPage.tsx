import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { Header } from '../components/Header';
import { bosses } from '../data/bosses';
import { CanvasEditor } from '../features/planner/CanvasEditor';
import { StepPanel } from '../features/planner/StepPanel';
import { ToolPalette } from '../features/planner/ToolPalette';
import { usePlannerStore } from '../store/plannerStore';
import { encodePlan } from '../lib/share';

export function PlannerPage() {
  const { bossSlug = '' } = useParams();
  const loadSeed = usePlannerStore((s) => s.loadSeedPlanByBoss);
  const plan = usePlannerStore((s) => s.currentPlan);
  const save = usePlannerStore((s) => s.saveCurrentPlan);
  const exportPlan = usePlannerStore((s) => s.exportPlan);
  const importPlan = usePlannerStore((s) => s.importPlan);
  const selected = usePlannerStore((s) => s.selectedObjectId);
  const step = usePlannerStore((s) => s.currentPlan?.steps[s.currentStepIndex]);
  const updateObject = usePlannerStore((s) => s.updateObject);
  const del = usePlannerStore((s) => s.deleteSelectedObject);
  const dup = usePlannerStore((s) => s.duplicateSelectedObject);
  const toggleSnap = usePlannerStore((s) => s.toggleSnap);
  const snap = usePlannerStore((s) => s.snapToGrid);
  const zoom = usePlannerStore((s) => s.zoom);
  const setZoom = usePlannerStore((s) => s.setZoom);
  const [raw, setRaw] = useState('');

  useEffect(() => { loadSeed(bossSlug); }, [bossSlug, loadSeed]);

  const currentObj = useMemo(() => step?.objects.find((o) => o.id === selected), [step, selected]);
  const boss = bosses.find((b) => b.slug === bossSlug);

  return <div className="h-screen flex flex-col">
    <Header />
    <div className="px-3 py-2 text-sm border-b border-slate-800 flex items-center gap-2"><span className="font-semibold">{boss?.name}</span><button className="btn" onClick={save}>Save</button><button className="btn" onClick={() => setRaw(exportPlan() ?? '')}>Export JSON</button><button className="btn" onClick={() => raw && importPlan(raw)}>Import JSON</button><button className="btn" onClick={async () => { const node = document.getElementById('planner-canvas'); if (!node) return; const data = await toPng(node); const a = document.createElement('a'); a.href = data; a.download = `${bossSlug}-plan.png`; a.click(); }}>Export PNG</button><button className="btn" onClick={() => { if (!plan) return; const share = `${window.location.origin}/plan/${plan.id}?data=${encodePlan(plan)}`; navigator.clipboard.writeText(share); }}>Copy Share URL</button><Link className="btn" to={plan ? `/plan/${plan.id}` : '#'}>Presentation</Link></div>
    <div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
      <aside className="panel col-span-3 p-2 space-y-3 overflow-auto"><h3 className="font-semibold text-sm">Tools</h3><ToolPalette /><div className="space-y-1"><button className="btn" onClick={toggleSnap}>Snap: {snap ? 'On' : 'Off'}</button><div className="flex gap-1"><button className="btn" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>-</button><button className="btn" onClick={() => setZoom(1)}>Reset</button><button className="btn" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button></div></div></aside>
      <section className="col-span-6"><CanvasEditor /></section>
      <aside className="panel col-span-3 p-2 space-y-3 overflow-auto"><h3 className="font-semibold text-sm">Steps</h3><StepPanel /><h3 className="font-semibold text-sm">Object Inspector</h3>{currentObj ? <div className="space-y-1 text-xs"><div>ID: {currentObj.id}</div><label className="text-xs">Label<input className="input" value={currentObj.text ?? ''} onChange={(e) => updateObject(currentObj.id, { text: e.target.value })} /></label><label className="text-xs">Color<input className="input" value={currentObj.color} onChange={(e) => updateObject(currentObj.id, { color: e.target.value })} /></label><div className="flex gap-1"><button className="btn" onClick={dup}>Duplicate</button><button className="btn" onClick={del}>Delete</button><button className="btn" onClick={() => updateObject(currentObj.id, { locked: !currentObj.locked })}>{currentObj.locked ? 'Unlock' : 'Lock'}</button><button className="btn" onClick={() => updateObject(currentObj.id, { stepVisibilityMode: currentObj.stepVisibilityMode === 'visible' ? 'hidden' : 'visible' })}>{currentObj.stepVisibilityMode}</button></div></div> : <p className="text-xs text-slate-400">Select an object.</p>}<textarea className="input min-h-32" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="JSON export/import buffer" /></aside>
    </div>
  </div>;
}
