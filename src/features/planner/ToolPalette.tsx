import { makeObject, usePlannerStore } from '../../store/plannerStore';
import type { ObjectType } from '../../types/planner';

const drawTools: { label: string; type: ObjectType }[] = [
  { label: 'Select Text', type: 'text-label' },
  { label: 'Arrow', type: 'arrow' },
  { label: 'Line', type: 'polyline' },
  { label: 'Circle', type: 'circle' },
  { label: 'Rectangle', type: 'rectangle' },
  { label: 'Cone', type: 'cone' },
  { label: 'Danger Zone', type: 'danger-zone' },
  { label: 'Safe Zone', type: 'safe-zone' },
];

const markerPresets: { label: string; type: ObjectType; text: string }[] = [
  { label: 'Tank', type: 'player-marker', text: 'Tank' },
  { label: 'Healer', type: 'player-marker', text: 'Healer' },
  { label: 'Melee', type: 'player-marker', text: 'Melee' },
  { label: 'Ranged', type: 'player-marker', text: 'Ranged' },
  { label: 'Group 1', type: 'group-marker', text: 'G1' },
  { label: 'Group 2', type: 'group-marker', text: 'G2' },
  { label: 'Group 3', type: 'group-marker', text: 'G3' },
  { label: 'Group 4', type: 'group-marker', text: 'G4' },
  { label: 'Skull', type: 'raid-marker', text: 'Skull' },
  { label: 'Cross', type: 'raid-marker', text: 'Cross' },
  { label: 'Square', type: 'raid-marker', text: 'Square' },
  { label: 'Moon', type: 'raid-marker', text: 'Moon' },
  { label: 'Star', type: 'raid-marker', text: 'Star' },
  { label: 'Triangle', type: 'raid-marker', text: 'Triangle' },
  { label: 'Diamond', type: 'raid-marker', text: 'Diamond' },
  { label: 'Circle', type: 'raid-marker', text: 'Circle' },
  { label: 'Boss', type: 'boss-marker', text: 'Boss' },
  { label: 'Add', type: 'add-marker', text: 'Add' },
];

export function ToolPalette() {
  const addObject = usePlannerStore((s) => s.addObject);

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs uppercase tracking-wide text-slate-400 mb-1">Drawing</h4>
        <div className="grid grid-cols-2 gap-1">
          {drawTools.map((tool) => (
            <button key={tool.label} className="btn" onClick={() => addObject(makeObject(tool.type))}>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-slate-400 mb-1">Marker presets</h4>
        <div className="grid grid-cols-2 gap-1">
          {markerPresets.map((preset) => (
            <button
              key={preset.label}
              className="btn"
              onClick={() => addObject({ ...makeObject(preset.type), text: preset.text })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
