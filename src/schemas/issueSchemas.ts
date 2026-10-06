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

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

// Makes all create issue fields optional for updating an issue
export const updateIssueSchema = createIssueSchema.partial();

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

// Used when changing only an issue's status
export const setStatusSchema = z.object({
  status: z.enum(["open", "in-progress", "closed"]),
});

export type SetStatusInput = z.infer<typeof setStatusSchema>;

// Used when changing only an issue's classification
export const classifyIssueSchema = z.object({
  classification: z.enum([
    "unclassified",
    "approved",
    "unapproved",
    "duplicate",
  ]),
});

export type ClassifyIssueInput = z.infer<typeof classifyIssueSchema>;

// Used when assigning an issue to another user
export const assignIssueSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(1),
});

export type AssignIssueInput = z.infer<typeof assignIssueSchema>;

// Used when adding a comment
export const addCommentSchema = z.object({
  comment: z.string().min(1),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;

// Used when marking a test case passed or failed
export const setTestCaseResultSchema = z.object({
  passed: z.boolean(),
});

export type SetTestCaseResultInput = z.infer<typeof setTestCaseResultSchema>;
