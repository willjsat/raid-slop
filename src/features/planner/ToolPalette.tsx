import { makeObject, usePlannerStore } from '../../store/plannerStore';
import type { ObjectType } from '../../types/planner';

const tools: { label: string; type: ObjectType }[] = [
  { label: 'Text', type: 'text-label' }, { label: 'Arrow', type: 'arrow' }, { label: 'Line', type: 'polyline' },
  { label: 'Circle', type: 'circle' }, { label: 'Rect', type: 'rectangle' }, { label: 'Cone', type: 'cone' },
  { label: 'Danger', type: 'danger-zone' }, { label: 'Safe', type: 'safe-zone' }, { label: 'Raid', type: 'raid-marker' },
  { label: 'Player', type: 'player-marker' }, { label: 'Group', type: 'group-marker' }, { label: 'Boss', type: 'boss-marker' }, { label: 'Add', type: 'add-marker' },
];

export function ToolPalette() {
  const addObject = usePlannerStore((s) => s.addObject);
  return <div className="grid grid-cols-2 gap-1">{tools.map((t) => <button key={t.type} className="btn" onClick={() => addObject(makeObject(t.type))}>{t.label}</button>)}</div>;
}
