import { Ambiance } from "./ambiance";
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
    name: 'Tokyo Cafe Live',
    code: '6uddGul0oAc',
    livestream: true,
    group: 'Jazz',
    channel: channels['Cafe Music BGM']
  }
]
