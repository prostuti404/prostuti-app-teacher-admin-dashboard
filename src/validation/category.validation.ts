// prostuti-app-teacher-admin-dashboard-staging/src/validation/category.validation.ts

import { z } from "zod";

// Update the category schema to include new fields
export const createCategorySchema = z
  .object({
    group: z.string({ required_error: "Group is required" }),
    type: z.string({ required_error: "Type is required" }),
    name: z.string({ required_error: "Name is required" }),
  });
