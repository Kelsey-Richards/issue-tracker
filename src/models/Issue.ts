// Student Name: Kelsey Richards
// Date: 9/6/2026

// defines the Issue interface for the issue tracker application.
export interface Issue {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
}