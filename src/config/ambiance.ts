// export const ambiances = [
//   {
//     name: "World of Warcraft - Lofi"
//   }
// ]

export type Ambiance = {
  name: string;
  code: string;
  segments?: number[]; // TODO: If video has chapters
};

export const worldOfWarcraft: Ambiance[] = [
  // Cities
  {
    name: 'Stormwind',
    code: 'roMWEeV2P4U'
  },
  {
    name: 'Orgrimmar',
    code: 'L_QA-ZUAOHk'
  },
  {
    name: 'Gilneas',
    code: 'R8jsJQnKhMo'
  },
  {
    name: 'Boralus',
    code: 'K3hjVijzrtM'
  },
  {
    name: 'Suramar',
    code: 'ACgoXvkhlPE'
  },
  {
    name: 'Dalaran (Broken Isles)',
    code: '1hRjNoUl4WQ'
  },
  {
    name: 'Undercity',
    code: 'WaG9K6Agx-0'
  },
  {
    name: 'Ironforge',
    code: 'aFbCofgwdXo'
  },

  // Races
  {
    name: 'Blood Elves',
    code: 'NLWRKwiG7lA',
  },
  {
    name: 'Draenei',
    code: 'eYfomyIugEQ'
  },

  // Random locations
  {
    name: 'Teldrassil',
    code: 'BV-v9bdMQp0'
  },
  {
    name: 'Ashenvale',
    code: 'xTPn_Nk_KrM'
  },
  {
    name: 'Eastern Plaguelands',
    code: 'rGiwjDZfW5s',
  },
  {
    name: 'Grizzly Hills',
    code: 'pWTSK5waNs8',
  },
  {
    name: 'Elwynn Forest',
    code: 'MW4fASDkQXA'
  },
  {
    name: 'Nagrand (Draenor)',
    code: '0msy-ALryyw'
  },
  {
    name: 'Kun-Lai Summit',
    code: 'FIeql1dS2GM'
  },
  {
    name: 'Valley of the Four Winds',
    code: '50EOOzhovjg'
  },
  {
    name: 'Jade Forest',
    code: 'nWcbYcU1eaQ'
  },
  {
    name: 'Dun Morogh',
    code: 'YfMn7UfZzGc'
  },

  // Raids
  {
    name: 'Icecrown Citadel',
    code: 'ne-JwpCXUbM'
  },

  // Taverns
  {
    name: 'Horde Taverns',
    code: 'HrvA2eAHcJ4'
  },
  {
    name: 'Alliance Taverns',
    code: 'Oeo2VCCtUZQ'
  },


  // TODO: Move to its own Overwatch section
  {
    name: 'Overwatch - Lofi',
    code: 'dp4miziEOvQ'
  }
];
