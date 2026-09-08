// Student Name: Kelsey Richards
// Date: 9/7/2026

// This middleware logs incoming HTTP requests using the debug library. It logs the HTTP method and URL of each request.
import { Request, Response, NextFunction } from "express";
import debug from "debug";

const log = debug("issue-tracker:request");

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  log(`${req.method} ${req.url}`);
  next();
}