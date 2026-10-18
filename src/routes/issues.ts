// Student Name: Kelsey Richards
// Date: 9/6/2026

// Routes for handling issues in the application
import { Router } from "express";

import {
  listIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  setIssueStatus,
  classifyIssue,
  assignIssue,
  addComment,
  deleteComment,
  addTestCase,
  setTestCaseResult,
  addTimeLog,
  getTimeLogSummary,
} from "../controllers/issuesController.js";

import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validate.js";
import { attachCurrentUser } from "../middleware/currentUser.js";

import {
  createIssueSchema,
  updateIssueSchema,
  setStatusSchema,
  classifyIssueSchema,
  assignIssueSchema,
  addCommentSchema,
  setTestCaseResultSchema,
  listIssuesQuerySchema,
  addTimeLogSchema,
  timeLogParamsSchema,
} from "../schemas/issueSchemas.js";

const issuesRouter = Router();

// Get all issues
issuesRouter.get("/", validateQuery(listIssuesQuerySchema), listIssues);

// Get one issue
issuesRouter.get("/:id", getIssueById);

// Create an issue
issuesRouter.post(
  "/",
  attachCurrentUser,
  validateBody(createIssueSchema),
  createIssue,
);

// Update an issue
issuesRouter.patch("/:id", validateBody(updateIssueSchema), updateIssue);

// Change issue status
issuesRouter.patch(
  "/:id/status",
  validateBody(setStatusSchema),
  setIssueStatus,
);

// Change issue classification
issuesRouter.patch(
  "/:id/classify",
  validateBody(classifyIssueSchema),
  classifyIssue,
);

// Assign an issue
issuesRouter.patch("/:id/assign", validateBody(assignIssueSchema), assignIssue);

// Add a comment
issuesRouter.post(
  "/:id/comments",
  attachCurrentUser,
  validateBody(addCommentSchema),
  addComment,
);

// Delete a comment
issuesRouter.delete("/:id/comments/:commentId", deleteComment);

// Add a test case
issuesRouter.post("/:id/test-cases", attachCurrentUser, addTestCase);

// Mark a test case as passed or failed
issuesRouter.patch(
  "/:id/test-cases/:testCaseId",
  validateBody(setTestCaseResultSchema),
  setTestCaseResult,
);

// Delete an issue
issuesRouter.delete("/:id", deleteIssue);

// Add hours worked to an issue
issuesRouter.post(
  "/:id/time-log",
  attachCurrentUser,
  validateBody(addTimeLogSchema),
  addTimeLog,
);

// Get the total hours worked on an issue
issuesRouter.get(
  "/:id/time-log/summary",
  validateParams(timeLogParamsSchema),
  getTimeLogSummary,
);

// Export the router
export default issuesRouter;
