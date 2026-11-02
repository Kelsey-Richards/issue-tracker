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
import { loadIssue } from "../middleware/loadIssue.js";
import {
  requireIssueRule,
  requirePermissionOr,
} from "../middleware/requireIssueRule.js";
import {
  canEditIssue,
  canWorkOnIssue,
  canDeleteComment,
} from "../issueRules.js";
import { requireAssignableUser } from "../middleware/requireAssignableUser.js";

// Closing an issue requires its own role permission
function onlyWhenClosing(check: RequestHandler): RequestHandler {
  return (req, res, next) =>
    req.body.status === "closed" ? check(req, res, next) : next();
}

// Other status changes require issue ownership
function exceptWhenClosing(check: RequestHandler): RequestHandler {
  return (req, res, next) =>
    req.body.status === "closed" ? next() : check(req, res, next);
}

// Only the assigned user can work on the issue
const assigneeOnly = [
  loadIssue,
  requireIssueRule(
    canWorkOnIssue,
    "Only the person this issue is assigned to may do that",
  ),
];

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

// Update an issue - author only
issuesRouter.patch(
  "/:id",
  validateBody(updateIssueSchema),
  loadIssue,
  requireIssueRule(canEditIssue, "Only the author may edit this issue"),
  updateIssue,
);

// Change issue status
issuesRouter.patch(
  "/:id/status",
  validateBody(setStatusSchema),
  onlyWhenClosing(requirePermission("issue", "close")),
  exceptWhenClosing(loadIssue),
  exceptWhenClosing(
    requireIssueRule(
      canWorkOnIssue,
      "Only the person this issue is assigned to may do that",
    ),
  ),
  setIssueStatus,
);

// Change issue classification
issuesRouter.patch(
  "/:id/classify",
  requirePermission("issue", "classify"),
  validateBody(classifyIssueSchema),
  classifyIssue,
);

// Assign an issue - manager or current assignee
issuesRouter.patch(
  "/:id/assign",
  requirePermissionOr(
    "issue",
    "assign",
    (req) => canWorkOnIssue(req.issue, req.user),
    "Only a manager, or the person this issue is assigned to, may assign it",
  ),
  validateBody(assignIssueSchema),
  requireAssignableUser,
  assignIssue,
);

// Add a comment
issuesRouter.post(
  "/:id/comments",
  requirePermission("comment", "create"),
  validateBody(addCommentSchema),
  addComment,
);

// Delete a comment - author or permitted manager
issuesRouter.delete(
  "/:id/comments/:commentId",
  requirePermissionOr(
    "comment",
    "deleteAny",
    (req) =>
      canDeleteComment(req.issue, req.params.commentId as string, req.user),
    "Only the comment's author or a Technical Manager may delete it",
  ),
  deleteComment,
);

// Add a test case
issuesRouter.post(
  "/:id/test-cases",
  requirePermission("testCase", "create"),
  assigneeOnly,
  addTestCase,
);

// Mark a test case as passed or failed
issuesRouter.patch(
  "/:id/test-cases/:testCaseId",
  requirePermission("testCase", "setResult"),
  assigneeOnly,
  validateBody(setTestCaseResultSchema),
  setTestCaseResult,
);

// Delete an issue
issuesRouter.delete("/:id", requirePermission("issue", "delete"), deleteIssue);

// Add hours worked
issuesRouter.post(
  "/:id/time-log",
  requirePermission("timeLog", "create"),
  assigneeOnly,
  validateBody(addTimeLogSchema),
  addTimeLog,
);

// Get total hours worked
issuesRouter.get(
  "/:id/time-log/summary",
  validateParams(timeLogParamsSchema),
  getTimeLogSummary,
);

export default issuesRouter;
