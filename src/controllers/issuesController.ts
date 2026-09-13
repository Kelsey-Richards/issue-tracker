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
export function getIssueById(req: Request, res: Response, next: NextFunction) {
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

// Controller function to update an existing issue
export function updateIssue(req: Request, res: Response) {
  const id = Number(req.params.id);
  const issue = issues.find((issue) => issue.id === id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (req.body.title !== undefined) {
    issue.title = req.body.title;
  }

  if (req.body.description !== undefined) {
    issue.description = req.body.description;
  }

  if (req.body.status !== undefined) {
    issue.status = req.body.status;
  }

  if (req.body.priority !== undefined) {
    issue.priority = req.body.priority;
  }

  res.status(200).json(issue);
}

// Controller function to delete an existing issue
export function deleteIssue(req: Request, res: Response) {
  const id = Number(req.params.id);
  const issueIndex = issues.findIndex((issue) => issue.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issues.splice(issueIndex, 1);

  res.status(204).send();
}
