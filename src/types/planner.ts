import { z } from 'zod';

export const ObjectTypeSchema = z.enum([
  'player-marker','group-marker','raid-marker','boss-marker','add-marker','text-label','arrow','polyline','rectangle','circle','cone','danger-zone','safe-zone','image-icon','callout-badge'
]);

export type ObjectType = z.infer<typeof ObjectTypeSchema>;

export const DrawableObjectSchema = z.object({
  id: z.string(),
  type: ObjectTypeSchema,
  x: z.number(),
  y: z.number(),
  rotation: z.number().default(0),
  scale: z.number().default(1),
  width: z.number().default(60),
  height: z.number().default(60),
  strokeWidth: z.number().default(2),
  color: z.string().default('#f8fafc'),
  fill: z.string().default('rgba(148,163,184,0.25)'),
  opacity: z.number().default(1),
  text: z.string().optional(),
  iconKey: z.string().optional(),
  stepVisibilityMode: z.enum(['visible','hidden']).default('visible'),
  locked: z.boolean().default(false),
  points: z.array(z.number()).optional(),
});

export const StepSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string(),
  objects: z.array(DrawableObjectSchema),
  timer: z.number().optional(),
  phase: z.string().optional(),
  bossHealthRange: z.string().optional(),
});

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  bossSlug: z.string(),
  difficulty: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  canvasBackground: z.string(),
  steps: z.array(StepSchema),
});

export type DrawableObject = z.infer<typeof DrawableObjectSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Plan = z.infer<typeof PlanSchema>;

export interface BossEncounter {
  slug: string;
  name: string;
  description: string;
  difficulty: 'Heroic';
  background: string;
}

export interface Raid {
  id: string;
  name: string;
  bosses: BossEncounter[];
}
