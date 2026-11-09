import { z } from "zod";

// Checks the title and description entered by the user.
export const triageInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1500),
});

// Checks that the AI's suggestion has the correct information.
export const triageSuggestionSchema = z.object({
  classification: z.enum(["approved", "unapproved", "duplicate"]),
  priority: z.enum(["low", "medium", "high"]),
  reason: z.string().min(1).max(300),
  duplicateOf: z
    .string()
    .regex(/^[0-9a-f]{24}$/, "duplicateOf must be an issue id")
    .optional(),
});

export type TriageInput = z.infer<typeof triageInputSchema>;
export type TriageSuggestion = z.infer<typeof triageSuggestionSchema>;
