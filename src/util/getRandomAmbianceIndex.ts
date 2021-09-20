import { Ambiance } from "../config/ambiance";

export const getRandomAmbianceIndex = (arr: Ambiance[], currentIndex: number): number => {
  if (arr.length === 1) {
    return 0
  }

  const randomIndex = Math.floor(Math.random() * arr.length);

  return randomIndex === currentIndex
    ? getRandomAmbianceIndex(arr, currentIndex)
    : randomIndex;
};
