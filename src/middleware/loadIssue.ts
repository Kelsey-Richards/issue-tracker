import type { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import type { Issue } from "../data/issues.js";
import { getIssuesCollection } from "../db.js";

// Find an issue using the ID from the URL
export async function findIssue(
  req: Request,
  res: Response,
): Promise<Issue | undefined> {
  let id: ObjectId;

  try {
    id = new ObjectId(req.params.id as string);
  } catch {
    res.status(400).json({ error: "Invalid issue id" });
    return undefined;
  }

  const issue = await getIssuesCollection().findOne({ _id: id });

  if (!issue) {
    res.status(404).json({ error: "Issue not found" });
    return undefined;
  }

  return issue;
}

// Save the issue on the request for the next middleware
export async function loadIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const issue = await findIssue(req, res);

    if (!issue) return;

    req.issue = issue;
    next();
  } catch (err) {
    next(err);
  }
}
