import { create } from 'zustand';
import type { Ambiance } from './config/ambiance/types';
import { getFallbackCatalog, loadAmbianceCatalog, type AmbianceCatalog } from './data/ambianceCatalog';
import { getRandomAmbianceIndex } from './util/getRandomAmbianceIndex';

export type AppState = {
  videoShown: boolean;
  catalog: AmbianceCatalog;
  favoriteCategoryId?: string;
  currentAmbianceCategoryId: string;
  currentAmbianceIndex: number;
  refreshCatalog: () => Promise<void>;
  setVideoShown: (shown: boolean) => void;
  setCurrentAmbianceCategoryId: (id: string) => void;
  setCurrentAmbianceIndex: (index: number) => void;
  setFavoriteCategoryId: (id?: string) => void;
  toggleFavoriteCategory: (id: string) => void;
  getCurrentCategoryVideos: () => Ambiance[];
};

const initialCatalog = getFallbackCatalog();
const preferredDefaultCategoryId = 'worldOfWarcraft';

const FAVORITE_CATEGORY_STORAGE_KEY = 'ambiance:favoriteCategoryId:v1';

const readFavoriteCategoryId = (): string | undefined => {
  try {
    const value = window.localStorage.getItem(FAVORITE_CATEGORY_STORAGE_KEY);
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  } catch {
    return undefined;
  }
};

const writeFavoriteCategoryId = (id?: string): void => {
  try {
    if (!id) {
      window.localStorage.removeItem(FAVORITE_CATEGORY_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(FAVORITE_CATEGORY_STORAGE_KEY, id);
  } catch {
    // ignore
  }
};

const initialFavoriteCategoryId = readFavoriteCategoryId();

const initialCategoryId =
  initialFavoriteCategoryId
  ?? ((preferredDefaultCategoryId in initialCatalog
      ? preferredDefaultCategoryId
      : Object.keys(initialCatalog)[0]) || preferredDefaultCategoryId);

const initialVideos = initialCatalog[initialCategoryId]?.videos ?? [];
const initialIndex = getRandomAmbianceIndex(initialVideos, -1);

export const useAppStore = create<AppState>()((set, get) => ({
  videoShown: true,
  catalog: initialCatalog,
  favoriteCategoryId: initialFavoriteCategoryId,
  currentAmbianceCategoryId: initialCategoryId,
  currentAmbianceIndex: initialIndex,
  refreshCatalog: async () => {
    const catalog = await loadAmbianceCatalog();

    set((state) => {
      const desiredCategoryId = state.favoriteCategoryId;

      const nextCategoryId = state.currentAmbianceCategoryId in catalog
        ? state.currentAmbianceCategoryId
        : Object.keys(catalog)[0] || state.currentAmbianceCategoryId;

      const resolvedCategoryId = desiredCategoryId && desiredCategoryId in catalog
        ? desiredCategoryId
        : nextCategoryId;

      const nextVideos = catalog[resolvedCategoryId]?.videos ?? [];
      const nextIndex =
        state.currentAmbianceIndex >= 0 && state.currentAmbianceIndex < nextVideos.length
          ? state.currentAmbianceIndex
          : getRandomAmbianceIndex(nextVideos, -1);

      return {
        catalog,
        currentAmbianceCategoryId: resolvedCategoryId,
        currentAmbianceIndex: nextIndex,
      };
    });
  },
  setVideoShown: (shown) => set({ videoShown: shown }),
  setCurrentAmbianceCategoryId: (id) =>
    set((state) => {
      const videos = state.catalog[id]?.videos ?? [];
      const nextIndex = getRandomAmbianceIndex(videos, -1);
      return { currentAmbianceCategoryId: id, currentAmbianceIndex: nextIndex };
    }),
  setCurrentAmbianceIndex: (index) => set({ currentAmbianceIndex: index }),
  setFavoriteCategoryId: (id) => {
    writeFavoriteCategoryId(id);
    set({ favoriteCategoryId: id });
  },
  toggleFavoriteCategory: (id) => {
    const currentFavorite = get().favoriteCategoryId;
    const nextFavorite = currentFavorite === id ? undefined : id;
    writeFavoriteCategoryId(nextFavorite);
    set({ favoriteCategoryId: nextFavorite });
  },
  getCurrentCategoryVideos: () => {
    const state = get();
    return state.catalog[state.currentAmbianceCategoryId]?.videos ?? [];
  },
}));
