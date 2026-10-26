import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

// Checks whether the user is signed in
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Look for a valid session using the request's cookies
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  // Stop the request if nobody is signed in
  if (!session) {
    return res.status(401).json({ error: "Please sign in first" });
  }

  // Save the real signed-in user's information
  req.user = { userId: session.user.id, fullName: session.user.name };

  // Allow the request to continue
  next();
}
