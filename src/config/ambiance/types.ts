import { Channel } from "./channels";

export type Ambiance = {
  name: string;
  code: string;
  group: string;
  startTimeS?: number;
  channel?: Channel;
  livestream?: boolean;
  /** Marked true when the player fails to load (e.g. video removed). */
  invalid?: boolean;
};

export type AmbianceCategory = {
  icon: string,
  name: string,
  videos: Ambiance[]
}
