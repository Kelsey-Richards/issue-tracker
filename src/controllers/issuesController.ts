// Student Name: Kelsey Richards
// Date: 9/8/2026

// Controller for handling issues in the application
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { getIssuesCollection } from "../db.js";

// List all issues
export async function listIssues(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const issues = getIssuesCollection();
    const issueList = await issues.find({}).toArray();

    res.status(200).json(issueList);
  } catch (err) {
    next(err);
  }
}

// Get one issue by ID
export async function getIssueById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let objectId: ObjectId;

  try {
    objectId = new ObjectId(req.params.id as string);
  } catch {
    return res.status(400).json({ error: "Invalid issue id" });
  }

  try {
    const issues = getIssuesCollection();
    const issue = await issues.findOne({ _id: objectId });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    next(err);
  }
}

// Create a new issue
export async function createIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, description, priority } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const newIssue = {
      title,
      description,
      status: "open" as const,
      priority: priority || "medium",
    };

    const issues = getIssuesCollection();
    const result = await issues.insertOne(newIssue);

    res.status(201).json({
      _id: result.insertedId,
      ...newIssue,
    });
  } catch (err) {
    next(err);
  }
}

// Update an issue
export async function updateIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let objectId: ObjectId;

  try {
    objectId = new ObjectId(req.params.id as string);
  } catch {
    return res.status(400).json({ error: "Invalid issue id" });
  }

  try {
    const issues = getIssuesCollection();

    const updates = {
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.description !== undefined && {
        description: req.body.description,
      }),
      ...(req.body.status !== undefined && { status: req.body.status }),
      ...(req.body.priority !== undefined && { priority: req.body.priority }),
    };

    const result = await issues.updateOne({ _id: objectId }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const updatedIssue = await issues.findOne({ _id: objectId });

    res.status(200).json(updatedIssue);
  } catch (err) {
    next(err);
  }
}

// Delete an issue
export async function deleteIssue(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let objectId: ObjectId;

  try {
    objectId = new ObjectId(req.params.id as string);
  } catch {
    return res.status(400).json({ error: "Invalid issue id" });
  }

  try {
    const issues = getIssuesCollection();

    const result = await issues.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
