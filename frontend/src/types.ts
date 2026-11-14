import { z } from "zod";

// Define the allowed status and priority values.
export const statusSchema = z.enum(["open", "in-progress", "closed"]);
export const prioritySchema = z.enum(["low", "medium", "high"]);

// Describe the user who created or is assigned an issue.
const userRefSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
});

// Describe what an issue looks like when it comes from our API.
export const issueSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  stepsToReproduce: z.string(),
  priority: prioritySchema,
  status: statusSchema,
  author: userRefSchema,
  assignedTo: userRefSchema.optional(),
  createdOn: z.string(),
});

// Create TypeScript types from our Zod schemas.
export type Status = z.infer<typeof statusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type Issue = z.infer<typeof issueSchema>;
export type StatusFilter = Status | "all";
