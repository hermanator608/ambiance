import { create } from 'zustand';
import { AmbianceName, ambianceCategories } from './config/ambiance';
import { getRandomAmbianceIndex } from './util/getRandomAmbianceIndex';

type AppState = {
  videoShown: boolean;
  currentAmbianceCategoryName: AmbianceName;
  currentAmbianceIndex: number;
  setVideoShown: (shown: boolean) => void;
  setCurrentAmbianceCategoryName: (name: AmbianceName) => void;
  setCurrentAmbianceIndex: (index: number) => void;
};

const defaultAmbianceCategoryName: AmbianceName = 'worldOfWarcraft';
const defaultAmbianceIndex = getRandomAmbianceIndex(
  ambianceCategories[defaultAmbianceCategoryName],
  -1,
);

export const useAppStore = create<AppState>((set) => ({
  videoShown: true,
  currentAmbianceCategoryName: defaultAmbianceCategoryName,
  currentAmbianceIndex: defaultAmbianceIndex,
  setVideoShown: (shown) => set({ videoShown: shown }),
  setCurrentAmbianceCategoryName: (name) => set({ currentAmbianceCategoryName: name }),
  setCurrentAmbianceIndex: (index) => set({ currentAmbianceIndex: index }),
}));
