import { Ambiance } from '../types';
import { easternKingdoms } from './easternKingdoms';
import { kalimdor } from './kalimdor';
import { northrend } from './northrend';
import { pandaria } from './pandaria';
import { draenor } from './draenor';
import { brokenIsles } from './brokenIsles';
import { argus } from './argus';
import { kulTiras } from './kulTiras';
import { zuldazar } from './zuldazar';
import { shadowlands } from './shadowlands';
import { miscellaneous } from './miscellaneous';
import { outland } from './outland';

export const worldOfWarcraft: Ambiance[] = [
  ...easternKingdoms,
  ...kalimdor,
  ...outland,
  ...northrend,
  ...pandaria,
  ...draenor,
  ...brokenIsles,
  ...argus,
  ...kulTiras,
  ...zuldazar,
  ...shadowlands,
  ...miscellaneous
];
