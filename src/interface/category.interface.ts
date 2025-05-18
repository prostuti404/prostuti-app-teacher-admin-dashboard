// Typescript interface for category types
export const categoryType = ["Academic", "Admission", "Job"] as const;
export type CategoryType = typeof categoryType[number];

export const categoryDivision = ["Science", "Arts", "Commerce"] as const;
export type CategoryDivision = typeof categoryDivision[number];

export const categoryUniversityType = ["Engineering", "Medical", "University"] as const;
export type CategoryUniversityType = typeof categoryUniversityType[number];

// Define common interfaces
interface BaseCategory {
    _id: string;
    type: CategoryType;
    subject: string;
    createdAt: string;
    updatedAt: string;
}

// Academic category
export interface AcademicCategory extends BaseCategory {
    type: "Academic";
    division: CategoryDivision;
    chapter?: string;
    lesson?: string; // New field
}

// Admission category
export interface AdmissionCategory extends BaseCategory {
    type: "Admission";
    universityType: CategoryUniversityType;
    universityName: string;
    unit?: string; // New field
}

// Job category
export interface JobCategory extends BaseCategory {
    type: "Job";
    jobType: string; // New field
    jobName: string; // New field
}

// Union type for all category types
export type Category = AcademicCategory | AdmissionCategory | JobCategory;

// Input types for creating categories
export interface CreateAcademicCategoryInput {
    type: "Academic";
    division: CategoryDivision;
    subject: string;
    chapter?: string;
    lesson?: string;
}

export interface CreateAdmissionCategoryInput {
    type: "Admission";
    universityType: CategoryUniversityType;
    universityName: string;
    subject: string;
    unit?: string;
}

export interface CreateJobCategoryInput {
    type: "Job";
    jobType: string;
    jobName: string;
    subject: string;
}

export type CreateCategoryInput =
    | CreateAcademicCategoryInput
    | CreateAdmissionCategoryInput
    | CreateJobCategoryInput;