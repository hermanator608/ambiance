// export const ambiances = [
//   {
//     name: "World of Warcraft - Lofi"
//   }
// ]

export type Ambiance = {
  name: string;
  code: string;
  group: string;
  segments?: number[]; // TODO: If video has chapters
};

export const worldOfWarcraft: Ambiance[] = [
  // Cities
  {
    name: 'Stormwind',
    code: 'roMWEeV2P4U',
    group: 'Eastern Kingdoms',
  },
  {
    name: 'Orgrimmar',
    code: 'L_QA-ZUAOHk',
    group: 'Kalimdor',
  },
  {
    name: 'Gilneas',
    code: 'R8jsJQnKhMo',
    group: 'Eastern Kingdoms',
  },
  {
    name: 'Boralus',
    code: 'K3hjVijzrtM',
    group: 'Kul Tiras',
  },
  {
    name: 'Suramar',
    code: 'ACgoXvkhlPE',
    group: 'Broken Isles',
  },
  {
    name: 'Dalaran (Broken Isles)',
    code: '1hRjNoUl4WQ',
    group: 'Broken Isles',
  },
  {
    name: 'Undercity',
    code: 'WaG9K6Agx-0',
    group: 'Eastern Kingdoms',
  },
  {
    name: 'Ironforge',
    code: 'aFbCofgwdXo',
    group: 'Eastern Kingdoms',
  },

  // Races
  {
    name: 'Blood Elves',
    code: 'NLWRKwiG7lA',
    group: 'Races',
  },
  {
    name: 'Draenei',
    code: 'eYfomyIugEQ',
    group: 'Races',
  },

  // Random locations
  {
    name: 'Teldrassil',
    code: 'BV-v9bdMQp0',
    group: 'Kalimdor',
  },
  {
    name: 'Ashenvale',
    code: 'xTPn_Nk_KrM',
    group: 'Kalimdor',
  },
  {
    name: 'Eastern Plaguelands',
    code: 'rGiwjDZfW5s',
    group: 'Eastern Kingdoms',
  },
  {
    name: 'Grizzly Hills',
    code: 'pWTSK5waNs8',
    group: 'Northrend',
  },
  {
    name: 'Elwynn Forest',
    code: 'MW4fASDkQXA',
    group: 'Eastern Kingdoms',
  },
  {
    name: 'Nagrand (Draenor)',
    code: '0msy-ALryyw',
    group: 'Draenor',
  },
  {
    name: 'Kun-Lai Summit',
    code: 'FIeql1dS2GM',
    group: 'Pandaria',
  },
  {
    name: 'Valley of the Four Winds',
    code: '50EOOzhovjg',
    group: 'Pandaria',
  },
  {
    name: 'Jade Forest',
    code: 'nWcbYcU1eaQ',
    group: 'Pandaria',
  },
  {
    name: 'Dun Morogh',
    code: 'YfMn7UfZzGc',
    group: 'Eastern Kingdoms',
  },

  // Raids
  {
    name: 'Icecrown Citadel',
    code: 'ne-JwpCXUbM',
    group: 'Northrend',
  },

  // Taverns
  {
    name: 'Horde Taverns',
    code: 'HrvA2eAHcJ4',
    group: 'Miscellaneous',
  },
  {
    name: 'Alliance Taverns',
    code: 'Oeo2VCCtUZQ',
    group: 'Miscellaneous',
  },

  // TODO: Move to its own Overwatch section
  {
    name: 'Overwatch - Lofi',
    code: 'dp4miziEOvQ',
    group: 'Overwatch',
  },
];
