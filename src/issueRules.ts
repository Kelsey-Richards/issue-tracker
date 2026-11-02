import type { Issue, IssueUserRef } from "./data/issues.js";

// Only the issue's author can edit it.
export function canEditIssue(issue: Issue, user: IssueUserRef): boolean {
  return issue.author.userId === user.userId;
}

// Only the assigned person can work on an issue.
export function canWorkOnIssue(issue: Issue, user: IssueUserRef): boolean {
  return issue.assignedTo?.userId === user.userId;
}

// Only the comment's author can delete their own comment.
export function canDeleteComment(
  issue: Issue,
  commentId: string,
  user: IssueUserRef,
): boolean {
  const comment = issue.comments?.find((c) => c._id === commentId);
  return comment?.userId === user.userId;
}
