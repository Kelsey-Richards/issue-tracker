import type { Issue, IssueUserRef } from "../data/issues.js";

// Add a user property to Express Request
declare global {
  namespace Express {
    interface Request {
      user: IssueUserRef;
      role: string;
      issue: Issue;
    }
  }
}

export {};
