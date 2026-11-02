import type { Request, Response, NextFunction } from "express";
import type { Issue, IssueUserRef } from "../data/issues.js";
import { userCan } from "./requirePermission.js";
import { findIssue } from "./loadIssue.js";
import { statement } from "../permissions.js";

type Resource = keyof typeof statement;

// Check whether the signed-in user owns the issue
export function requireIssueRule(
  check: (issue: Issue, user: IssueUserRef) => boolean,
  message: string,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!check(req.issue, req.user)) {
      return res.status(403).json({ error: message });
    }

    next();
  };
}

// Allow access through either a role permission or an ownership rule
export function requirePermissionOr<R extends Resource>(
  resource: R,
  action: (typeof statement)[R][number],
  check: (req: Request) => boolean,
  message: string,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await userCan(req.user.userId, resource, action)) {
        return next();
      }

      const issue = await findIssue(req, res);
      if (!issue) return;

      req.issue = issue;

      if (!check(req)) {
        return res.status(403).json({ error: message });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
