import { ICategory } from "../types/types";

// helper function to type safe the arrays
export const getUniqueStrings = (items: ICategory[], key: string): string[] => {
    return [...new Set(items.map(item => (item as any)[key] as string))].filter(Boolean);
};