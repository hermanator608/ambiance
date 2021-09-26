import { Ambiance } from "./ambiance";
import { channels } from "./channels";

export const lofi: Ambiance[] = [
  {
    name: 'Relax/Study',
    code: '5qap5aO4i9A',
    group: 'Lofi Girl',
    livestream: true,
    channel: undefined
  },
  {
    name: 'Sleep/Chill',
    code: 'DWcJFNfaw9c',
    group: 'Lofi Girl',
    livestream: true,
    channel: undefined
  },

  {
    name: 'Coffee Shop Hip-Hop Beats',
    code: '-5KAN9_CzSA',
    group: 'Coffee Shop',
    livestream: true,
    channel: channels["STEEZYASFUCK"]
  },

  {
    name: 'Rainy Night Coffee Shop',
    code: 'c0_ejQQcrwI',
    group: 'Coffee Shop',
    startTimeS: 6,
    channel: undefined
  },
  {
    name: 'Lofi Hip Hop Cafe',
    code: '3K1UoQmKZY4',
    group: 'Coffee Shop',
    livestream: true,
    channel: channels["lofi geek"]
  },

  {
    name: 'Soft Rain Jazz Piano',
    code: 'GA9GigGuf24',
    group: 'Jazz',
    channel: undefined
  },

  {
    name: 'Tokyo Lofi Hip Hop',
    code: 'Q4tM7RTSrRw',
    group: 'Hip Hop',
    livestream: true,
    channel: channels["lofi geek"]
  },

  {
    name: 'Lofi Space Station',
    code: 'pDv6y6txivM',
    group: 'Space',
    livestream: true,
    channel: channels["lofi geek"]
  },
  {
    name: 'Space Hip Hop',
    code: 'Qt0-9mO-ZXY',
    group: 'Space',
    livestream: true,
    channel: channels["lofi geek"]
  },

  // TODO: Move to its own Overwatch section
  {
    name: 'Overwatch - Lofi',
    code: 'dp4miziEOvQ',
    group: 'Gaming',
    channel: channels['Overwatch League']
  },
  {
    name: 'World of Warcraft - Lofi',
    code: 'UWrslj9JQnc',
    group: 'Gaming',
    channel: channels["World of Warcraft"]
  },
  {
    name: 'Zelda & Chill',
    code: 'GdzrrWA8e7A',
    group: 'Gaming',
    channel: channels.GameChops
  },
  {
    name: 'Zelda & Chill 2',
    code: 'rJlY1uKL87k',
    group: 'Gaming',
    channel: channels.GameChops
  },
  {
    name: 'Video Game Study Lounge',
    code: 'dFVYDD5JEHg',
    group: 'Gaming',
    livestream: true,
    channel: channels.GameChops
  }
]
