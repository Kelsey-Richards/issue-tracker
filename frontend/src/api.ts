import { z } from "zod";
import { issueSchema } from "./types";
import type { Issue, Status } from "./types";
import type { CreateIssueInput } from "./schemas/issueForm";

type FieldProblem = { path: string; message: string };

// Store the error message and status from our API.
export class ApiError extends Error {
  status: number;
  details: FieldProblem[];

  constructor(status: number, message: string, details: FieldProblem[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Send requests to our API and check for errors.
async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, init);

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let details: FieldProblem[] = [];

    try {
      const body: unknown = await res.json();

      if (typeof body === "object" && body !== null) {
        if ("error" in body && typeof body.error === "string") {
          message = body.error;
        }
        if ("details" in body && Array.isArray(body.details)) {
          details = body.details;
        }
      }
    } catch {
      // Use the default message if the response isn't JSON.
    }

    throw new ApiError(res.status, message, details);
  }

  return res;
}

// Check that the data matches our Zod schema.
async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const res = await send(path, init);
  return schema.parse(await res.json());
}

// Prepare JSON data for requests that change an issue.
function withBody(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// The four fields someone fills out when creating an issue.
export type IssueDraft = CreateIssueInput;

// Get the issues from our backend.
export function listIssues(): Promise<Issue[]> {
  return getJson("/issues", z.array(issueSchema));
}

// Get one issue using its MongoDB ID.
export function getIssue(id: string): Promise<Issue> {
  return getJson(`/issues/${id}`, issueSchema);
}

// Send a new issue to our backend.
export function createIssue(draft: IssueDraft): Promise<Issue> {
  return getJson("/issues", issueSchema, withBody("POST", draft));
}

// Update specific fields on an existing issue.
export function updateIssue(
  id: string,
  changes: Partial<IssueDraft>,
): Promise<Issue> {
  return getJson(`/issues/${id}`, issueSchema, withBody("PATCH", changes));
}

// Change an issue's status.
export function setStatus(id: string, status: Status): Promise<Issue> {
  return getJson(
    `/issues/${id}/status`,
    issueSchema,
    withBody("PATCH", { status }),
  );
}

// Delete an issue from the database.
export async function deleteIssue(id: string): Promise<void> {
  await send(`/issues/${id}`, { method: "DELETE" });
}
