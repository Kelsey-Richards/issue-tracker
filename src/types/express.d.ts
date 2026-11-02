import { IssueUserRef } from "../data/issues.js";

// Add a user property to Express Request
declare global {
  namespace Express {
    interface Request {
      user: IssueUserRef;
      role: string; // Stores the signed-in user's role
    }
  }
}

export {};
