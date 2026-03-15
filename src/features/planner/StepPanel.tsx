import { usePlannerStore } from '../../store/plannerStore';

export function StepPanel() {
  const plan = usePlannerStore((s) => s.currentPlan);
  const idx = usePlannerStore((s) => s.currentStepIndex);
  const setStep = usePlannerStore((s) => s.setCurrentStep);
  const addStep = usePlannerStore((s) => s.addStep);
  const dup = usePlannerStore((s) => s.duplicateStep);
  const del = usePlannerStore((s) => s.deleteStep);
  const rename = usePlannerStore((s) => s.updateStepName);
  const notes = usePlannerStore((s) => s.updateStepNotes);

  if (!plan) return null;
  const step = plan.steps[idx];
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">{plan.steps.map((s, i) => <button key={s.id} className={`btn ${i===idx?'bg-sky-700':''}`} onClick={() => setStep(i)}>{i + 1}</button>)}</div>
      <div className="flex gap-1"><button className="btn" onClick={() => addStep(true)}>+ Copy Step</button><button className="btn" onClick={() => dup(idx)}>Duplicate</button><button className="btn" onClick={() => del(idx)}>Delete</button></div>
      <input className="input" value={step.name} onChange={(e) => rename(idx, e.target.value)} />
      <textarea className="input min-h-24" value={step.notes} onChange={(e) => notes(idx, e.target.value)} />
    </div>
  );
}
