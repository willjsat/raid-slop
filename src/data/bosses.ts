import { arenaSvgs } from './backgrounds/arenaSvgs';
import type { BossEncounter, Raid } from '../types/planner';

export const bosses: BossEncounter[] = [
  { slug: 'imperator-averzian', name: 'Imperator Averzian', description: 'Tile room with rotating rune detonations and add waves.', difficulty: 'Heroic', background: arenaSvgs['imperator-averzian'] },
  { slug: 'vorasius', name: 'Vorasius', description: 'Cross-shaped arena with wall and choke movement checks.', difficulty: 'Heroic', background: arenaSvgs.vorasius },
  { slug: 'fallen-king-salhadaar', name: 'Fallen-King Salhadaar', description: 'Circular platform with orb soaks and collapse windows.', difficulty: 'Heroic', background: arenaSvgs['fallen-king-salhadaar'] },
  { slug: 'vaelgor-ezzorak', name: 'Vaelgor & Ezzorak', description: 'Twin bosses requiring split handling and timed merges.', difficulty: 'Heroic', background: arenaSvgs['vaelgor-ezzorak'] },
  { slug: 'lightblinded-vanguard', name: 'Lightblinded Vanguard', description: 'Council fight with triad positioning and beam overlaps.', difficulty: 'Heroic', background: arenaSvgs['lightblinded-vanguard'] },
  { slug: 'chimaerus-undreamt-god', name: 'Chimaerus the Undreamt God', description: 'Layered arena with lane swaps and heavy end-phase movement.', difficulty: 'Heroic', background: arenaSvgs['chimaerus-undreamt-god'] },
];

export const voidspireRaid: Raid = {
  id: 'voidspire',
  name: 'The Voidspire',
  bosses,
};
