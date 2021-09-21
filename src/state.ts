import { atom, atomFamily, selectorFamily } from "recoil";
import { worldOfWarcraft } from "./config/ambiance";
import { getRandomAmbianceIndex } from "./util/getRandomAmbianceIndex";

// TODO: Setup LS? Query Strings?

export const videoShownState = atom({
  key: "videoShown",
  default: true,
});

export const currentAmbianceCategoryState = atom({
  key: "currentAmbianceCategory",
  default: worldOfWarcraft,
});

export const currentAmbianceIndexState = atomFamily({
  key: 'currentAmbianceIndex',
  default: selectorFamily<number, number | undefined>({
    key: 'currentAmbianceIndex/Default',
    get: () => ({get}) => {
      const ambiances = get(currentAmbianceCategoryState);
      return getRandomAmbianceIndex(ambiances, -1);
    },
  }),
});

// export const currentAmbianceState = selector({
//   key: "currentAmbiance",
//   get: ({
//       get
//   }) => {
//     const ambiances = get(currentAmbianceCategoryState);
//     const currentAmbianceIndex = get(currentAmbianceIndexState(undefined));

//     return ambiances[currentAmbianceIndex]
//   },
// });
