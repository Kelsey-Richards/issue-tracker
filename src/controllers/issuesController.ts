// Student Name: Kelsey Richards
// Date: 9/8/2026

// Controller for handling issues in the application
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { getIssuesCollection } from "../db.js";

import {
  CreateIssueInput,
  UpdateIssueInput,
  SetStatusInput,
  ClassifyIssueInput,
  AssignIssueInput,
} from "../schemas/issueSchemas.js";

// Converts the id to an ObjectId
function parseId(req: Request, res: Response): ObjectId | undefined {
  try {
    return new ObjectId(req.params.id as string);
  } catch {
    res.status(400).json({ error: "Invalid issue id" });
    return undefined;
  }
}

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
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const issue = await issues.findOne({ _id: objectId });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue);
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
    // Body was already checked by Zod
    const input = req.body as CreateIssueInput;

    const newIssue = {
      ...input,
      status: "open" as const,
      classification: "unclassified" as const,
      author: req.user,
      createdOn: new Date(),
      comments: [],
      testCases: [],
      timeLog: [],
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

    // Body was already checked by Zod
    const updates = req.body as UpdateIssueInput;

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

    const result = await issues.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Change issue status
export async function setIssueStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const { status } = req.body as SetStatusInput;

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $set: { status } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Change issue classification
export async function classifyIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const { classification } = req.body as ClassifyIssueInput;

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $set: { classification } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Assign issue to a user
export async function assignIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const { userId, fullName } = req.body as AssignIssueInput;

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          assignedTo: {
            userId,
            fullName,
          },
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}
