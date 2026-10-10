// Student Name: Kelsey Richards
// Date: 9/8/2026

// Controller for handling issues in the application
import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongodb";

import { getIssuesCollection } from "../db.js";
import {
  CreateIssueInput,
  UpdateIssueInput,
  SetStatusInput,
  ClassifyIssueInput,
  AssignIssueInput,
  AddCommentInput,
  SetTestCaseResultInput,
  ListIssuesQuery,
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

// List issues with filters, search, and sorting
export async function listIssues(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const issues = getIssuesCollection();
    const query = req.query as unknown as ListIssuesQuery;

    // Build filters from the query parameters
    const filter: Record<string, unknown> = {};

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.classification) filter.classification = query.classification;
    if (query.assignedTo) filter["assignedTo.userId"] = query.assignedTo;

    const skip = (query.page - 1) * query.limit;

    // Use Atlas Search when a keyword is provided
    if (query.q) {
      const pipeline: Document[] = [
        {
          $search: {
            index: "default",
            text: {
              query: query.q,
              path: ["title", "description"],
            },
          },
        },
      ];

      if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
      }

      if (query.sort) {
        const descending = query.sort.startsWith("-");
        const field = descending ? query.sort.slice(1) : query.sort;

        pipeline.push({
          $sort: { [field]: descending ? -1 : 1 },
        });
      }

      pipeline.push({ $skip: skip }, { $limit: query.limit });

      return res.json(await issues.aggregate(pipeline).toArray());
    }

    // Regular filtering and sorting without keyword search
    const cursor = issues.find(filter);

    if (query.sort) {
      const descending = query.sort.startsWith("-");
      const field = descending ? query.sort.slice(1) : query.sort;

      cursor.sort({
        [field]: descending ? -1 : 1,
      });
    }

    cursor.skip(skip).limit(query.limit);

    res.json(await cursor.toArray());
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

// Add a comment to an issue
export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const { comment } = req.body as AddCommentInput;

    // Create the new comment
    const newComment = {
      _id: randomUUID(),
      userId: req.user.userId,
      fullName: req.user.fullName,
      comment,
      createdOn: new Date(),
    };

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $push: { comments: newComment } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Delete a comment from an issue
export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const commentId = req.params.commentId as string;

    // Remove the matching comment
    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $pull: { comments: { _id: commentId } } },
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

// Add a new test case to an issue
export async function addTestCase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();

    const newTestCase = {
      _id: randomUUID(),
      userId: req.user.userId,
      passed: false,
      createdOn: new Date(),
    };

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $push: { testCases: newTestCase } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Mark a test case as passed or failed
export async function setTestCaseResult(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const objectId = parseId(req, res);

  if (!objectId) return;

  try {
    const issues = getIssuesCollection();
    const testCaseId = req.params.testCaseId as string;
    const { passed } = req.body as SetTestCaseResultInput;

    const result = await issues.findOneAndUpdate(
      { _id: objectId },
      { $set: { "testCases.$[tc].passed": passed } },
      {
        arrayFilters: [{ "tc._id": testCaseId }],
        returnDocument: "after",
      },
    );

    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}
