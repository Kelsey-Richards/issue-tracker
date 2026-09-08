// Student Name: Kelsey Richards
// Date: 9/7/2026

// handle errors in the application by sending a 500 Internal Server Error response with a generic error message. 
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  res.status(500).json({ error: "Internal server error" });
}