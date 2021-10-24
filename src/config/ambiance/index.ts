import {worldOfWarcraft} from './wow'
import {lofi} from './lofi'
import {lotr} from './lotr'
import {zelda} from './zelda'
import {coffee} from './coffee'
import {earth} from './earth'
import {harryPotter} from './harryPotter'

export * from './types'
export * from './wow'
export * from './lofi'
export * from './lotr'
export * from './zelda'
export * from './coffee'
export * from './earth'
export * from './harryPotter'

export const ambianceCategories = {
  worldOfWarcraft,
  lofi,
  lotr,
  zelda,
  coffee,
  earth,
  harryPotter
}
export type AmbianceName = keyof typeof ambianceCategories
