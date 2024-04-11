import { Ambiance } from "./config/ambiance";

export type EditVideoFn = (documentId: string, videoUrlCode: string, newData: Ambiance) => Promise<void>;
export type DeleteVideoFn = (documentId: string, videoUrlCode: string) => Promise<void>;
export type AddVideoFn = (documentId: string, newData: Ambiance) => Promise<void>;


