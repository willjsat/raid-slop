import type { Plan } from '../types/planner';

export const encodePlan = (plan: Plan) => btoa(unescape(encodeURIComponent(JSON.stringify(plan))));
export const decodePlan = (encoded: string): Plan => JSON.parse(decodeURIComponent(escape(atob(encoded))));
