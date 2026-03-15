import { usePlannerStore } from '../../store/plannerStore';

export function StepPanel({ readOnly = false }: { readOnly?: boolean }) {
  const plan = usePlannerStore((s) => s.currentPlan);
  const index = usePlannerStore((s) => s.currentStepIndex);
  const setStep = usePlannerStore((s) => s.setCurrentStep);
  const addStep = usePlannerStore((s) => s.addStep);
  const duplicateStep = usePlannerStore((s) => s.duplicateStep);
  const moveStep = usePlannerStore((s) => s.moveStep);
  const deleteStep = usePlannerStore((s) => s.deleteStep);
  const updateName = usePlannerStore((s) => s.updateStepName);
  const updateNotes = usePlannerStore((s) => s.updateStepNotes);

  if (!plan) return null;
  const step = plan.steps[index];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {plan.steps.map((s, i) => (
          <button
            key={s.id}
            className={`btn ${i === index ? 'bg-sky-700 border-sky-500' : ''}`}
            onClick={() => setStep(i)}
            title={s.name}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {!readOnly ? (
        <>
          <div className="flex flex-wrap gap-1">
            <button className="btn" onClick={() => addStep(true)}>+ Copy Prev</button>
            <button className="btn" onClick={() => addStep(false)}>+ Empty</button>
            <button className="btn" onClick={() => duplicateStep(index)}>Duplicate</button>
            <button className="btn" onClick={() => moveStep(index, -1)}>↑</button>
            <button className="btn" onClick={() => moveStep(index, 1)}>↓</button>
            <button className="btn" onClick={() => deleteStep(index)}>Delete</button>
          </div>

          <input
            className="input"
            value={step.name}
            onChange={(e) => updateName(index, e.target.value)}
            placeholder="Step title"
          />
          <textarea
            className="input min-h-24"
            value={step.notes}
            onChange={(e) => updateNotes(index, e.target.value)}
            placeholder="Step notes"
          />
        </>
      ) : (
        <div className="text-xs text-slate-200 space-y-1">
          <div className="font-semibold">{step.name}</div>
          <p className="text-slate-300">{step.notes}</p>
        </div>
      )}

      <div className="text-xs text-slate-400">
        {step.phase ? `${step.phase}` : 'No phase'}
        {step.bossHealthRange ? ` • ${step.bossHealthRange}` : ''}
      </div>
    </div>
  );
}
