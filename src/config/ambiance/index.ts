import { worldOfWarcraft } from './wow';
import { lofi } from './lofi';
import { lotr } from './lotr';
import { zelda } from './zelda';
import { coffee } from './coffee';
import { earth } from './earth';
import { harryPotter } from './harryPotter';
import { animalCrossing } from './animalCrossing';
import {bg3} from './bg3';

export * from './types';
export * from './wow';
export * from './lofi';
export * from './lotr';
export * from './zelda';
export * from './coffee';
export * from './earth';
export * from './harryPotter';
export * from './animalCrossing';
export * from './bg3';

export const ambianceCategories = {
  worldOfWarcraft,
  lofi,
  lotr,
  zelda,
  coffee,
  earth,
  harryPotter,
  animalCrossing,
  bg3
};
export type AmbianceName = keyof typeof ambianceCategories;


export const ambianceCategoryDetail = {
  worldOfWarcraft: {
    name: "World of Warcraft",
    icon: "wow"
  },
  lofi: {
    name: "Lofi",
    icon: "lofi"
  },
  lotr: {
    name: "The Lord of the Rings",
    icon: "lotr"
  },
  zelda: {
    name: "The Legend of Zelda",
    icon: "zelda"
  },
  coffee:{
    name: "Coffee",
    icon: "coffee"
  },
  earth: {
    name: "Earth",
    icon: "world"
  },
  harryPotter: {
    name: "Harry Potter",
    icon: "harryPotter"
  },
  animalCrossing: {
    name: "Animal Crossing",
    icon: "animalCrossing"
  },
  bg3: {
    name: "Baldur's Gate 3",
    icon: "bg3"
  }

}
