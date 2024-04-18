import { Ambiance } from "./config/ambiance";

export type EditVideoFn = (documentId: string, videoUrlCode: string, newData: Ambiance) => Promise<void>;
export type DeleteVideoFn = (documentId: string, videoUrlCode: string) => Promise<void>;
export type AddVideoFn = (documentId: string, newData: Ambiance) => Promise<void>;

export type EditCategoryFn = (documentID: string, documentName: string, icon: string) => Promise<void>;
export type AddCategoryFn = (documentID: string, documentName: string, icon: string) => Promise<void>;
export type DeleteCategoryFn = (documentID: string) => Promise<void>;