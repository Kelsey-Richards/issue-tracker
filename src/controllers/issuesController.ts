// Student Name: Kelsey Richards
// Date: 9/8/2026

// Controller for handling issues in the application
import { Request, Response, NextFunction } from "express";
import { issues, getNextId } from "../data/issues";

// Controller function to list all issues
export function listIssues(req: Request, res: Response) {
  res.status(200).json(issues);
}

// Controller function to get a specific issue by ID
export function getIssueById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const issue = issues.find((issue) => issue.id === id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    next(err);
  }
}

// Controller function to create a new issue
export function createIssue(req: Request, res: Response) {
  const { title, description, priority } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  const newIssue = {
    id: getNextId(),
    title,
    description,
    status: "open" as const,
    priority: priority || "medium",
  };

  issues.push(newIssue);

  res.status(201).json(newIssue);
}