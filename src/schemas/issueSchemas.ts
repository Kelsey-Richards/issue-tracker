// Student Name: Kelsey Richards
// Date: 9/29/2026

import { z } from "zod";

// Validates the information a client can send when creating an issue
export const createIssueSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  stepsToReproduce: z.string().min(1, "stepsToReproduce is required"),
  priority: z.enum(["low", "medium", "high"]),
});

// Creates the TypeScript type directly from the Zod schema
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
