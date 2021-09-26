import { Ambiance } from './ambiance';
import { channels } from './channels';

export const worldOfWarcraft: Ambiance[] = [
  // Cities
  {
    name: 'Stormwind',
    code: 'roMWEeV2P4U',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },
  {
    name: 'Orgrimmar',
    code: 'L_QA-ZUAOHk',
    group: 'Kalimdor',
    channel: channels.Everness
  },
  {
    name: 'Gilneas',
    code: 'R8jsJQnKhMo',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },

  {
    name: 'Suramar',
    code: 'ACgoXvkhlPE',
    group: 'Broken Isles',
    channel: channels.Everness
  },
  {
    name: 'Dalaran (Broken Isles)',
    code: '1hRjNoUl4WQ',
    group: 'Broken Isles',
    channel: channels.Everness
  },
  {
    name: 'Undercity',
    code: 'WaG9K6Agx-0',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },
  {
    name: 'Ironforge',
    code: 'aFbCofgwdXo',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },

  // Battle For Azeroth
  {
    name: 'Boralus',
    code: 'K3hjVijzrtM',
    group: 'Kul Tiras',
    channel: channels.Everness
  },

  // Shadowlands
  {
    name: 'Bastion',
    code: 'skLxajC4nyk',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'Ardenweald',
    code: 'OwmMI3TjXj0',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'Revendreth',
    code: 'zkH-vxrB58w',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'Maldraxxus',
    code: 'YYT83lM47yk',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'Oribos',
    code: 'PtrhE4z9leU',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'The Maw',
    code: 'gvcFcZDhg-I',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },
  {
    name: 'Korthia',
    code: 't_Z75KVAl4Y',
    group: 'Shadowlands',
    channel: channels.Meisio,
  },

  // Races
  {
    name: 'Blood Elves',
    code: 'NLWRKwiG7lA',
    group: 'Races',
    channel: channels.Everness
  },
  {
    name: 'Draenei',
    code: 'eYfomyIugEQ',
    group: 'Races',
    channel: channels.Everness
  },

  // Random locations
  {
    name: 'Tirisfal Glades (Rain)',
    code: 'b02OhyWNZv8',
    group: 'Eastern Kingdoms',
    channel: channels.Meisio
  },
  {
    name: 'Teldrassil',
    code: 'BV-v9bdMQp0',
    group: 'Kalimdor',
    channel: channels.Everness
  },
  {
    name: 'Ashenvale',
    code: 'xTPn_Nk_KrM',
    group: 'Kalimdor',
    channel: channels.Everness
  },
  {
    name: 'Eastern Plaguelands',
    code: 'rGiwjDZfW5s',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },
  {
    name: 'Grizzly Hills',
    code: 'pWTSK5waNs8',
    group: 'Northrend',
    channel: channels.Everness
  },
  {
    name: 'Elwynn Forest',
    code: 'MW4fASDkQXA',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },
  {
    name: 'Nagrand (Draenor)',
    code: '0msy-ALryyw',
    group: 'Draenor',
    channel: channels.Everness
  },
  {
    name: 'Kun-Lai Summit',
    code: 'FIeql1dS2GM',
    group: 'Pandaria',
    channel: channels.Everness
  },
  {
    name: 'Valley of the Four Winds',
    code: '50EOOzhovjg',
    group: 'Pandaria',
    channel: channels.Everness
  },
  {
    name: 'Jade Forest',
    code: 'nWcbYcU1eaQ',
    group: 'Pandaria',
    channel: channels.Everness
  },
  {
    name: 'Dun Morogh',
    code: 'YfMn7UfZzGc',
    group: 'Eastern Kingdoms',
    channel: channels.Everness
  },

  // Raids
  {
    name: 'Icecrown Citadel',
    code: 'ne-JwpCXUbM',
    group: 'Northrend',
    channel: channels.Everness
  },

  // Taverns
  {
    name: 'Horde Taverns',
    code: 'HrvA2eAHcJ4',
    group: 'Miscellaneous',
    channel: channels.Everness
  },
  {
    name: 'Alliance Taverns',
    code: 'Oeo2VCCtUZQ',
    group: 'Miscellaneous',
    channel: channels.Everness
  },
  {
    name: 'Livestream',
    code: '2j0OPN3-u3s',
    group: 'Miscellaneous',
    livestream: true,
    channel: channels.Meisio,
  },
];
