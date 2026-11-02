// Routes for handling issues in the application
import { Router, type RequestHandler } from "express";

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

import { requirePermission } from "../middleware/requirePermission.js";

// Only check closing permission when the new status is "closed"
function onlyWhenClosing(check: RequestHandler): RequestHandler {
  return (req, res, next) =>
    req.body.status === "closed" ? check(req, res, next) : next();
}

const issuesRouter = Router();

// Get all issues
issuesRouter.get("/", validateQuery(listIssuesQuerySchema), listIssues);

// Get one issue
issuesRouter.get("/:id", getIssueById);

// Create an issue
issuesRouter.post(
  "/",
  requirePermission("issue", "create"),
  validateBody(createIssueSchema),
  createIssue,
);

// Update an issue
issuesRouter.patch("/:id", validateBody(updateIssueSchema), updateIssue);

// Change issue status
issuesRouter.patch(
  "/:id/status",
  validateBody(setStatusSchema),
  onlyWhenClosing(requirePermission("issue", "close")),
  setIssueStatus,
);

// Change issue classification
issuesRouter.patch(
  "/:id/classify",
  requirePermission("issue", "classify"),
  validateBody(classifyIssueSchema),
  classifyIssue,
);

// Assign an issue
issuesRouter.patch(
  "/:id/assign",
  requirePermission("issue", "assign"),
  validateBody(assignIssueSchema),
  assignIssue,
);

// Add a comment
issuesRouter.post(
  "/:id/comments",
  requirePermission("comment", "create"),
  validateBody(addCommentSchema),
  addComment,
);

// Delete a comment
issuesRouter.delete("/:id/comments/:commentId", deleteComment);

// Add a test case
issuesRouter.post(
  "/:id/test-cases",
  requirePermission("testCase", "create"),
  addTestCase,
);

// Mark a test case as passed or failed
issuesRouter.patch(
  "/:id/test-cases/:testCaseId",
  requirePermission("testCase", "setResult"),
  validateBody(setTestCaseResultSchema),
  setTestCaseResult,
);

// Delete an issue
issuesRouter.delete("/:id", requirePermission("issue", "delete"), deleteIssue);

// Add hours worked to an issue
issuesRouter.post(
  "/:id/time-log",
  requirePermission("timeLog", "create"),
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
