// Student Name: Kelsey Richards
// Date: 9/26/2026

// Defines what an issue looks like.
export interface Issue {
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
}