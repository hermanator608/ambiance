import { Ambiance } from "./types";
import { channels } from "./channels";

export const coffee: Ambiance[] = [
  {
    name: 'Soft Rain Jazz Piano',
    code: 'GA9GigGuf24',
    group: 'Jazz',
    channel: channels['Cold Water']
  },
  {
    name: 'Rainy Night Coffee Shop',
    code: 'c0_ejQQcrwI',
    group: 'Jazz',
    startTimeS: 6,
    channel: channels['Calmed by Nature'],
  },
  {
    name: '',
    code: 'VMAPTo7RVCo',
    group: 'Jazz',
    channel: channels['Calmed by Nature'],
    startTimeS: 6,
  },
  {
    name: 'Lofi Hip Hop Cafe',
    code: '3K1UoQmKZY4',
    group: 'Lofi Coffee',
    livestream: true,
    channel: channels['lofi geek'],
  },
  {
    name: "Autum Rooftop Cafe",
    code: 'vNZOQiQHBaY',
    group: 'Jazz',
    channel: channels["Coffee Shop Vibes"]
  },
  {
    name: 'Jazz Piano Live',
    code: 'DrmcAh2FRHQ',
    livestream: true,
    group: 'Jazz',
    channel: channels["Coffee Shop Vibes"]
  },
  {
    name: 'Cafe Crackling Fireplace',
    code: 'wSEWdmmk_1o',
    group: 'Jazz',
    channel: channels['Coffee Shop Vibes']
  },
  {
    name: 'Tokyo Cafe Live',
    code: '6uddGul0oAc',
    livestream: true,
    group: 'Jazz',
    channel: channels['Cafe Music BGM']
  },
  {
    name: 'Royal Library',
    code: 'CHFif_y2TyM',
    group: 'Library',
    channel: channels['New Bliss']
  },
  {
    name: 'Cozy Christmas',
    code: 'FvMA_kX_qjA',
    group: 'Holidays'
  },
  {
    name: 'Weekend Book Cafe',
    code: 'P1HrmvPvxtc',
    group: 'Library',
    startTimeS: 14
  }
]