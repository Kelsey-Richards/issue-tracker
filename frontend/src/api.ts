import { z } from "zod";
import { issueSchema } from "./types";
import type { Issue } from "./types";

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

// Get the issues from our backend.
export function listIssues(): Promise<Issue[]> {
  return getJson("/issues", z.array(issueSchema));
}
