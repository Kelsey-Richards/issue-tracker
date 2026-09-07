// Student Name: Kelsey Richards
// Date: 9/6/2026

// This file contains a list of issues for the issue tracker application.
import { Issue } from "../models/Issue";

export const issues: Issue[] = [
  {
    id: 1,
    title: "Login page error",
    description: "Users are unable to log in.",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    title: "Profile image not loading",
    description: "User profile pictures are not displaying correctly.",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Update button not working",
    description: "The update button does not save changes.",
    status: "closed",
    priority: "low",
  },
];

// Function to get the next available issue ID
let nextId = 4;

export function getNextId(): number {
  return nextId++;
}
