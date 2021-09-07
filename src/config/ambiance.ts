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
  {
    name: 'Eastern Plaguelands',
    code: 'rGiwjDZfW5s',
  },
  {
    name: 'Blood Elves',
    code: 'NLWRKwiG7lA',
  },
  {
    name: 'Draenei',
    code: 'eYfomyIugEQ'
  },
  {
    name: 'Gilneas',
    code: 'R8jsJQnKhMo'
  },
  {
    name: 'Grizzly Hills',
    code: 'pWTSK5waNs8',
  },
  {
    name: 'Elwynn Forest',
    code: 'MW4fASDkQXA'
  },
  { // TODO: Move to its own Overwatch section
    name: 'Overwatch - Lofi',
    code: 'dp4miziEOvQ'
  }
];
