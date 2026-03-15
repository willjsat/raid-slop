import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { Header } from '../components/Header';
import { bosses } from '../data/bosses';
import { CanvasEditor } from '../features/planner/CanvasEditor';
import { StepPanel } from '../features/planner/StepPanel';
import { ToolPalette } from '../features/planner/ToolPalette';
import { encodePlan } from '../lib/share';
import { usePlannerStore } from '../store/plannerStore';

export function PlannerPage() {
  const { bossSlug = '' } = useParams();
  const [raw, setRaw] = useState('');
  const [status, setStatus] = useState('');

  const loadSeed = usePlannerStore((s) => s.loadSeedPlanByBoss);
  const plan = usePlannerStore((s) => s.currentPlan);
  const stepIndex = usePlannerStore((s) => s.currentStepIndex);
  const selected = usePlannerStore((s) => s.selectedObjectId);
  const save = usePlannerStore((s) => s.saveCurrentPlan);
  const exportPlan = usePlannerStore((s) => s.exportPlan);
  const importPlan = usePlannerStore((s) => s.importPlan);
  const updateObject = usePlannerStore((s) => s.updateObject);
  const del = usePlannerStore((s) => s.deleteSelectedObject);
  const dup = usePlannerStore((s) => s.duplicateSelectedObject);
  const toggleSnap = usePlannerStore((s) => s.toggleSnap);
  const snap = usePlannerStore((s) => s.snapToGrid);
  const zoom = usePlannerStore((s) => s.zoom);
  const setZoom = usePlannerStore((s) => s.setZoom);

  useEffect(() => {
    loadSeed(bossSlug);
  }, [bossSlug, loadSeed]);

  const boss = bosses.find((b) => b.slug === bossSlug);
  const step = plan?.steps[stepIndex];
  const currentObj = useMemo(() => step?.objects.find((o) => o.id === selected), [selected, step]);

  const onImport = () => {
    if (!raw.trim()) return;
    const result = importPlan(raw);
    setStatus(result.message);
  };

  const onExportPng = async () => {
    const node = document.getElementById('planner-canvas');
    if (!node) return;
    const data = await toPng(node);
    const link = document.createElement('a');
    link.href = data;
    link.download = `${bossSlug}-plan.png`;
    link.click();
  };

  const onCopyShare = async () => {
    if (!plan) return;
    const share = `${window.location.origin}/plan/${plan.id}?data=${encodePlan(plan)}`;
    await navigator.clipboard.writeText(share);
    setStatus('Share URL copied.');
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="px-3 py-2 text-sm border-b border-slate-800 flex flex-wrap items-center gap-2">
        <span className="font-semibold">{boss?.name ?? 'Planner'}</span>
        <button className="btn" onClick={save}>Save</button>
        <button className="btn" onClick={() => setRaw(exportPlan() ?? '')}>Export JSON</button>
        <button className="btn" onClick={onImport}>Import JSON</button>
        <button className="btn" onClick={onExportPng}>Export PNG</button>
        <button className="btn" onClick={onCopyShare}>Copy Share URL</button>
        <Link className="btn" to={plan ? `/plan/${plan.id}` : '#'}>Presentation</Link>
        {status ? <span className="text-xs text-emerald-300">{status}</span> : null}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 p-2 overflow-hidden">
        <aside className="panel md:col-span-3 p-2 space-y-3 overflow-auto">
          <h3 className="font-semibold text-sm">Tools</h3>
          <ToolPalette />
          <div className="space-y-1">
            <button className="btn" onClick={toggleSnap}>Snap: {snap ? 'On' : 'Off'}</button>
            <div className="flex gap-1">
              <button className="btn" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>-</button>
              <button className="btn" onClick={() => setZoom(1)}>Reset</button>
              <button className="btn" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button>
            </div>
          </div>
        </aside>

        <section className="md:col-span-6 min-h-80">
          <CanvasEditor />
        </section>

        <aside className="panel md:col-span-3 p-2 space-y-3 overflow-auto">
          <h3 className="font-semibold text-sm">Steps</h3>
          <StepPanel />

          <h3 className="font-semibold text-sm">Object Inspector</h3>
          {currentObj ? (
            <div className="space-y-1 text-xs">
              <div>ID: {currentObj.id}</div>
              <label>
                Label
                <input
                  className="input"
                  value={currentObj.text ?? ''}
                  onChange={(e) => updateObject(currentObj.id, { text: e.target.value })}
                />
              </label>
              <label>
                Color
                <input
                  className="input"
                  value={currentObj.color}
                  onChange={(e) => updateObject(currentObj.id, { color: e.target.value })}
                />
              </label>
              <div className="flex flex-wrap gap-1">
                <button className="btn" onClick={dup}>Duplicate</button>
                <button className="btn" onClick={del}>Delete</button>
                <button className="btn" onClick={() => updateObject(currentObj.id, { locked: !currentObj.locked })}>
                  {currentObj.locked ? 'Unlock' : 'Lock'}
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    updateObject(currentObj.id, {
                      stepVisibilityMode: currentObj.stepVisibilityMode === 'visible' ? 'hidden' : 'visible',
                    })
                  }
                >
                  {currentObj.stepVisibilityMode}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select an object.</p>
          )}

          <textarea
            className="input min-h-32"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="JSON export/import buffer"
          />
        </aside>
      </div>
    </div>
  );
}
