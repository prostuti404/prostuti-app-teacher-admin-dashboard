// prostuti-app-teacher-admin-dashboard-staging/src/validation/category.validation.ts

import { z } from "zod";

// Update the category schema to include new fields
export const createCategorySchema = z
  .object({
    type: z.string({ required_error: "Category type is required" }),
    // Academic fields
    division: z.string().optional(),
    subject: z.string({ required_error: "Subject is required" }),
    chapter: z.string().optional(),
    lesson: z.string().optional(), // New field

    // Admission fields
    universityType: z.string().optional(),
    universityName: z.string().optional(),
    unit: z.string().optional(), // New field

    // Job fields
    jobType: z.string().optional(), // New field
    jobName: z.string().optional(), // New field
  })
  .refine(
    (data) => {
      // For Academic type, division is required
      if (data.type === "Academic") {
        return !!data.division;
      }
      return true;
    },
    {
      message: "Division is required for Academic category",
      path: ["division"],
    }
  )
  .refine(
    (data) => {
      // For Admission type, universityType is required
      if (data.type === "Admission") {
        return !!data.universityType;
      }
      return true;
    },
    {
      message: "University Type is required for Admission category",
      path: ["universityType"],
    }
  )
  .refine(
    (data) => {
      // For Admission type, universityName is required
      if (data.type === "Admission") {
        return !!data.universityName;
      }
      return true;
    },
    {
      message: "University Name is required for Admission category",
      path: ["universityName"],
    }
  )
  .refine(
    (data) => {
      // For Job type, jobType is required
      if (data.type === "Job") {
        return !!data.jobType;
      }
      return true;
    },
    {
      message: "Job Type is required for Job category",
      path: ["jobType"],
    }
  )
  .refine(
    (data) => {
      // For Job type, jobName is required
      if (data.type === "Job") {
        return !!data.jobName;
      }
      return true;
    },
    {
      message: "Job Name is required for Job category",
      path: ["jobName"],
    }
  );
