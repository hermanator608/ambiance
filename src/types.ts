import { Ambiance } from "./config/ambiance";

export type EditVideoFn = (documentId: string, videoUrlCode: string, newData: Ambiance) => Promise<void>;
export type DeleteVideoFn = (documentId: string, videoUrlCode: string) => Promise<void>;
export type AddVideoFn = (documentId: string, newData: Ambiance) => Promise<void>;

export type EditCategoryFn = (documentID: string, documentName: string, icon: string) => Promise<void>;
export type AddCategoryFn = (documentID: string, documentName: string, icon: string) => Promise<void>;
export type DeleteCategoryFn = (documentID: string) => Promise<void>;

/**
 * Ambiance[] is an array of videos
 */
export type SubcategoryMap = Record<string, Ambiance[]>;

/**
 * friendlyName is ambiance category name
 */
export type SubcategoryGroupingType = {
  friendlyName: string;
  videosBySubcategory: SubcategoryMap;
}

/**
 * Key (string value) is documentId
 */
export type AmbianceDisplayType = Record<string, SubcategoryGroupingType>;