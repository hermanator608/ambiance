import { atom, atomFamily, selectorFamily } from "recoil";
import { ambianceCategories, AmbianceName } from "./config/ambiance";
import { getRandomAmbianceIndex } from "./util/getRandomAmbianceIndex";

// TODO: Setup LS? Query Strings?

export const videoShownState = atom({
  key: "videoShown",
  default: true,
});

export const currentAmbianceCategoryNameState = atom<AmbianceName>({
  key: "currentAmbianceCategory",
  default: 'worldOfWarcraft',
});

// export const currentAmbianceCategoryState = selector({
//   key: "currentAmbianceCategory",
//   get: ({
//       get
//   }) => {
//     const ambianceName = get(currentAmbianceCategoryNameState);

//     return ambianceCategories[ambianceName]
//   },
// });

export const currentAmbianceIndexState = atomFamily({
  key: 'currentAmbianceIndex',
  default: selectorFamily<number, number | undefined>({
    key: 'currentAmbianceIndex/Default',
    get: () => ({get}) => {
      const ambianceName = get(currentAmbianceCategoryNameState);
      return getRandomAmbianceIndex(ambianceCategories[ambianceName], -1);
    },
  })
});
