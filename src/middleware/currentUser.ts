// Student Name: Kelsey Richards
// Date: 9/30/2026

import { Request, Response, NextFunction } from "express";

// Adds a temporary current user to each request
export function attachCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = {
    userId: "kelsey01",
    fullName: "Kelsey Richards",
  };

  next();
}