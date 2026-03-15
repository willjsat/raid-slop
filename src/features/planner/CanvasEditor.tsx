import { useEffect, useMemo, useRef } from 'react';
import { Layer, Rect, Stage, Text, Arrow, Circle, Transformer, Line, Group } from 'react-konva';
import type Konva from 'konva';
import { usePlannerStore } from '../../store/plannerStore';

const colorByType: Record<string, string> = { 'danger-zone': 'rgba(239,68,68,.3)', 'safe-zone': 'rgba(16,185,129,.3)', 'boss-marker': '#fb7185', 'player-marker': '#f59e0b', 'group-marker': '#60a5fa' };

export function CanvasEditor({ readOnly = false }: { readOnly?: boolean }) {
  const plan = usePlannerStore((s) => s.currentPlan);
  const idx = usePlannerStore((s) => s.currentStepIndex);
  const selectedId = usePlannerStore((s) => s.selectedObjectId);
  const select = usePlannerStore((s) => s.selectObject);
  const update = usePlannerStore((s) => s.updateObject);
  const zoom = usePlannerStore((s) => s.zoom);
  const snap = usePlannerStore((s) => s.snapToGrid);
  const trRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const step = plan?.steps[idx];
  useEffect(() => {
    if (!trRef.current || !stageRef.current || !selectedId) return;
    const node = stageRef.current.findOne(`#${selectedId}`);
    if (node) trRef.current.nodes([node]);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId, idx]);

  const bg = useMemo(() => {
    const img = new window.Image();
    if (plan?.canvasBackground) img.src = plan.canvasBackground;
    return img;
  }, [plan?.canvasBackground]);

  if (!plan || !step) return <div className="panel h-full grid place-items-center">Select a boss to start.</div>;

  return (
    <div id="planner-canvas" className="panel h-full overflow-hidden">
      <Stage ref={stageRef} width={1200} height={900} scaleX={zoom} scaleY={zoom} onMouseDown={(e) => { if (e.target === e.target.getStage()) select(undefined); }} draggable={!readOnly}>
        <Layer>
          <Rect x={0} y={0} width={1200} height={900} fillPatternImage={bg} fill="#0f172a" />
          {step.objects.filter((o) => o.stepVisibilityMode !== 'hidden').map((o) => {
            const common = {
              key: o.id, id: o.id, x: o.x, y: o.y, rotation: o.rotation, draggable: !readOnly && !o.locked,
              onClick: () => select(o.id),
              onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => update(o.id, { x: snap ? Math.round(e.target.x() / 20) * 20 : e.target.x(), y: snap ? Math.round(e.target.y() / 20) * 20 : e.target.y() }),
              onTransformEnd: (e: Konva.KonvaEventObject<Event>) => update(o.id, { rotation: e.target.rotation(), width: e.target.width() * e.target.scaleX(), height: e.target.height() * e.target.scaleY(), scale: 1 }),
            };
            if (o.type === 'circle' || o.type.includes('zone')) return <Circle {...common} radius={o.width / 2} fill={colorByType[o.type] ?? o.fill} stroke={o.color} strokeWidth={o.strokeWidth} />;
            if (o.type === 'arrow') return <Arrow {...common} points={o.points ?? [0, 0, 120, 0]} pointerLength={10} pointerWidth={10} stroke={o.color} fill={o.color} strokeWidth={o.strokeWidth} />;
            if (o.type === 'polyline' || o.type === 'cone') return <Line {...common} points={o.points ?? [0, 0, 80, 40, 160, 0]} closed={o.type === 'cone'} fill={o.type === 'cone' ? 'rgba(59,130,246,.25)' : undefined} stroke={o.color} strokeWidth={o.strokeWidth} />;
            return <Group key={o.id}>
              <Rect {...common} width={o.width} height={o.height} fill={colorByType[o.type] ?? o.fill} stroke={o.color} strokeWidth={o.strokeWidth} cornerRadius={8} />
              {o.text && <Text x={o.x + 6} y={o.y + 8} text={o.text} fill={o.color} fontSize={14} />}
            </Group>;
          })}
          {!readOnly && <Transformer ref={trRef} rotateEnabled enabledAnchors={['top-left','top-right','bottom-left','bottom-right']} />}
        </Layer>
      </Stage>
    </div>
  );
}
