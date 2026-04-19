import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { AMBIANCE_COLLECTION } from '../constants';
import type { AmbianceCategory } from '../config/ambiance/types';
import { ambianceCategories, ambianceCategoryDetail } from '../config/ambiance';

export type AmbianceCatalog = Record<string, AmbianceCategory>;

const LOCAL_STORAGE_KEY = 'ambiance:catalog:v1';
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 2; // 2h

type CachedCatalog = {
  fetchedAtMs: number;
  catalog: AmbianceCatalog;
};

export const getFallbackCatalog = (): AmbianceCatalog => {
  const catalog: AmbianceCatalog = {};

  Object.entries(ambianceCategories).forEach(([categoryId, videos]) => {
    const details = (ambianceCategoryDetail as any)[categoryId];
    catalog[categoryId] = {
      name: details?.name ?? categoryId,
      icon: details?.icon ?? 'world',
      videos,
    };
  });

  return catalog;
};

export const readCatalogFromLocalStorage = (): CachedCatalog | undefined => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CachedCatalog;
    if (!parsed || typeof parsed !== 'object') return undefined;
    if (!parsed.catalog || typeof parsed.fetchedAtMs !== 'number') return undefined;
    return parsed;
  } catch {
    return undefined;
  }
};

export const writeCatalogToLocalStorage = (catalog: AmbianceCatalog): void => {
  try {
    const payload: CachedCatalog = { fetchedAtMs: Date.now(), catalog };
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / JSON errors
  }
};

export const isCatalogFresh = (
  cached: CachedCatalog | undefined,
  ttlMs: number = DEFAULT_TTL_MS,
): boolean => {
  if (!cached) return false;
  return Date.now() - cached.fetchedAtMs < ttlMs;
};

export const fetchCatalogFromFirestore = async (): Promise<AmbianceCatalog> => {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, AMBIANCE_COLLECTION));
  const catalog: AmbianceCatalog = {};
  snapshot.forEach((doc) => {
    catalog[doc.id] = doc.data() as AmbianceCategory;
  });
  return catalog;
};

/**
 * Loads catalog for the public app.
 * - Uses cached value immediately if fresh.
 * - Otherwise fetches Firestore and caches.
 * - Falls back to bundled config if Firestore is empty/unavailable.
 */
export const loadAmbianceCatalog = async (opts?: {
  ttlMs?: number;
  preferCache?: boolean;
}): Promise<AmbianceCatalog> => {
  const isDev = Boolean(import.meta.env?.DEV);
  const ttlMs = opts?.ttlMs ?? DEFAULT_TTL_MS;
  const preferCache = opts?.preferCache ?? true;

  // In dev, always fetch fresh and don't touch localStorage.
  if (isDev) {
    try {
      const catalog = await fetchCatalogFromFirestore();
      if (Object.keys(catalog).length > 0) {
        return catalog;
      }
    } catch {
      // ignore
    }

    return getFallbackCatalog();
  }

  const cached = readCatalogFromLocalStorage();
  if (preferCache && isCatalogFresh(cached, ttlMs)) {
    return cached!.catalog;
  }

  try {
    const catalog = await fetchCatalogFromFirestore();
    if (Object.keys(catalog).length > 0) {
      writeCatalogToLocalStorage(catalog);
      return catalog;
    }
  } catch {
    // ignore
  }

  // If Firestore fetch fails or returns empty, use bundled fallback.
  return cached?.catalog ?? getFallbackCatalog();
};
