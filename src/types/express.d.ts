// Student Name: Kelsey Richards
// Date: 9/30/2026

import { IssueUserRef } from "../data/issues.js";

// Add a user property to Express Request
declare global {
  namespace Express {
    interface Request {
      user: IssueUserRef;
    }
  }
}

export {};
