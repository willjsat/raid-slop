import type { Plan } from '../../types/planner';
import { bosses } from '../bosses';
import averzian from './imperator-averzian.json';
import vorasius from './vorasius.json';
import salhadaar from './fallen-king-salhadaar.json';
import twins from './vaelgor-ezzorak.json';
import vanguard from './lightblinded-vanguard.json';
import chimaerus from './chimaerus-undreamt-god.json';

const seeded = [averzian, vorasius, salhadaar, twins, vanguard, chimaerus] as Plan[];

export const seededPlans: Record<string, Plan> = Object.fromEntries(
  seeded.map((plan) => {
    const boss = bosses.find((b) => b.slug === plan.bossSlug);
    return [plan.id, { ...plan, canvasBackground: boss?.background ?? '' }];
  }),
);

export const seededPlanList = Object.values(seededPlans);
export const seededByBoss = Object.fromEntries(seededPlanList.map((p) => [p.bossSlug, p])) as Record<string, Plan>;
