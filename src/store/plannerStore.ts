import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seededByBoss, seededPlans } from '../data/plans';
import type { DrawableObject, Plan } from '../types/planner';

const uid = () => Math.random().toString(36).slice(2, 10);

interface PlannerState {
  plans: Record<string, Plan>;
  currentPlan?: Plan;
  currentStepIndex: number;
  selectedObjectId?: string;
  selectedBoss?: string;
  readOnly: boolean;
  snapToGrid: boolean;
  zoom: number;
  setBoss: (slug: string) => void;
  loadSeedPlanByBoss: (slug: string) => void;
  loadPlanById: (id: string) => void;
  setCurrentPlan: (plan: Plan) => void;
  setCurrentStep: (index: number) => void;
  addStep: (copyPrevious: boolean) => void;
  duplicateStep: (index: number) => void;
  deleteStep: (index: number) => void;
  updateStepName: (index: number, name: string) => void;
  updateStepNotes: (index: number, notes: string) => void;
  selectObject: (id?: string) => void;
  addObject: (obj: DrawableObject) => void;
  updateObject: (id: string, patch: Partial<DrawableObject>) => void;
  deleteSelectedObject: () => void;
  duplicateSelectedObject: () => void;
  saveCurrentPlan: () => void;
  importPlan: (raw: string) => { ok: boolean; message: string };
  exportPlan: () => string | undefined;
  setReadOnly: (value: boolean) => void;
  toggleSnap: () => void;
  setZoom: (zoom: number) => void;
}

const stamp = () => new Date().toISOString();

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      plans: { ...seededPlans },
      currentPlan: undefined,
      currentStepIndex: 0,
      selectedObjectId: undefined,
      selectedBoss: undefined,
      readOnly: false,
      snapToGrid: false,
      zoom: 1,
      setBoss: (slug) => set({ selectedBoss: slug }),
      loadSeedPlanByBoss: (slug) => set({ currentPlan: structuredClone(seededByBoss[slug]), currentStepIndex: 0, selectedBoss: slug }),
      loadPlanById: (id) => set({ currentPlan: structuredClone(get().plans[id]), currentStepIndex: 0 }),
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      setCurrentStep: (index) => set({ currentStepIndex: index, selectedObjectId: undefined }),
      addStep: (copyPrevious) => set((state) => {
        if (!state.currentPlan) return state;
        const prev = state.currentPlan.steps[state.currentStepIndex];
        const newStep = {
          ...prev,
          id: uid(),
          name: `Step ${state.currentPlan.steps.length + 1}`,
          notes: '',
          objects: copyPrevious ? structuredClone(prev.objects) : [],
        };
        const steps = [...state.currentPlan.steps, newStep];
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() }, currentStepIndex: steps.length - 1 };
      }),
      duplicateStep: (index) => set((state) => {
        if (!state.currentPlan) return state;
        const source = state.currentPlan.steps[index];
        const clone = structuredClone(source);
        clone.id = uid();
        clone.name = `${source.name} Copy`;
        const steps = [...state.currentPlan.steps];
        steps.splice(index + 1, 0, clone);
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() } };
      }),
      deleteStep: (index) => set((state) => {
        if (!state.currentPlan || state.currentPlan.steps.length <= 1) return state;
        const steps = state.currentPlan.steps.filter((_, i) => i !== index);
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() }, currentStepIndex: Math.max(0, index - 1) };
      }),
      updateStepName: (index, name) => set((state) => {
        if (!state.currentPlan) return state;
        const steps = [...state.currentPlan.steps];
        steps[index] = { ...steps[index], name };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() } };
      }),
      updateStepNotes: (index, notes) => set((state) => {
        if (!state.currentPlan) return state;
        const steps = [...state.currentPlan.steps];
        steps[index] = { ...steps[index], notes };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() } };
      }),
      selectObject: (id) => set({ selectedObjectId: id }),
      addObject: (obj) => set((state) => {
        if (!state.currentPlan) return state;
        const steps = [...state.currentPlan.steps];
        steps[state.currentStepIndex] = { ...steps[state.currentStepIndex], objects: [...steps[state.currentStepIndex].objects, obj] };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() }, selectedObjectId: obj.id };
      }),
      updateObject: (id, patch) => set((state) => {
        if (!state.currentPlan) return state;
        const steps = [...state.currentPlan.steps];
        const cur = steps[state.currentStepIndex];
        steps[state.currentStepIndex] = { ...cur, objects: cur.objects.map((o) => o.id === id ? { ...o, ...patch } : o) };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() } };
      }),
      deleteSelectedObject: () => set((state) => {
        if (!state.currentPlan || !state.selectedObjectId) return state;
        const steps = [...state.currentPlan.steps];
        const cur = steps[state.currentStepIndex];
        steps[state.currentStepIndex] = { ...cur, objects: cur.objects.filter((o) => o.id !== state.selectedObjectId) };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() }, selectedObjectId: undefined };
      }),
      duplicateSelectedObject: () => set((state) => {
        if (!state.currentPlan || !state.selectedObjectId) return state;
        const cur = state.currentPlan.steps[state.currentStepIndex];
        const obj = cur.objects.find((o) => o.id === state.selectedObjectId);
        if (!obj) return state;
        const clone = { ...obj, id: uid(), x: obj.x + 20, y: obj.y + 20 };
        const steps = [...state.currentPlan.steps];
        steps[state.currentStepIndex] = { ...cur, objects: [...cur.objects, clone] };
        return { currentPlan: { ...state.currentPlan, steps, updatedAt: stamp() }, selectedObjectId: clone.id };
      }),
      saveCurrentPlan: () => set((state) => {
        if (!state.currentPlan) return state;
        return { plans: { ...state.plans, [state.currentPlan.id]: { ...state.currentPlan, updatedAt: stamp() } } };
      }),
      importPlan: (raw) => {
        try {
          const parsed = JSON.parse(raw) as Plan;
          set((state) => ({ plans: { ...state.plans, [parsed.id]: parsed }, currentPlan: parsed }));
          return { ok: true, message: 'Plan imported' };
        } catch {
          return { ok: false, message: 'Invalid JSON' };
        }
      },
      exportPlan: () => {
        const plan = get().currentPlan;
        return plan ? JSON.stringify(plan, null, 2) : undefined;
      },
      setReadOnly: (value) => set({ readOnly: value }),
      toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
      setZoom: (zoom) => set({ zoom }),
    }),
    { name: 'voidspire-planner' },
  ),
);

export const makeObject = (type: DrawableObject['type'], x = 600, y = 450): DrawableObject => ({
  id: uid(), type, x, y, rotation: 0, scale: 1, width: 90, height: 60, strokeWidth: 2, color: '#f8fafc', fill: 'rgba(59,130,246,.25)', opacity: 1, text: type.replace('-', ' '), stepVisibilityMode: 'visible', locked: false,
});
