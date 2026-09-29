// Student Name: Kelsey Richards
// Date: 9/29/2026

import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Checks the request body using the schema passed into it
export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // If validation fails, send a 400 error
    if (!result.success) {
      return res.status(400).json({
        error: "ValidationFailed",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // Replace the body with the clean, validated data
    req.body = result.data;

    next();
  };
}
