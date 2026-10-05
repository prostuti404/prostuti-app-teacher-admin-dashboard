// Typescript interface for category types

export interface ICategory {
    _id?: string;
    group: string;
    type: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export type Category = ICategory;

export interface CreateCategoryInput {
    group: string;
    type: string;
    name: string;
}