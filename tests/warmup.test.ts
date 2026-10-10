// Student Name: Kelsey Richards
// Date: 10/10/2026

import { describe, it, expect, vi } from "vitest";
import request from "supertest";

import { app } from "../src/app.js";
import { createIssueSchema } from "../src/schemas/issueSchemas.js";

// Uses a fake database so tests do not connect to MongoDB Atlas
vi.mock("../src/db.js", () => ({
  getIssuesCollection: vi.fn(),
  getDb: vi.fn(),
}));

// Simple test to make sure Vitest is working
describe("my very first test", () => {
  it("knows that 2 + 2 is 4", () => {
    expect(2 + 2).toBe(4);
  });
});

// Tests the create issue schema from the application
describe("createIssueSchema", () => {
  // Example of a complete valid issue
  const validIssue = {
    title: "Login button does nothing",
    description: "Clicking Login on Safari has no effect",
    stepsToReproduce: "1. Open Safari 2. Click Login",
    priority: "high",
  };

  // Checks that valid issue data is accepted
  it("accepts a complete, valid issue", () => {
    const result = createIssueSchema.safeParse(validIssue);

    expect(result.success).toBe(true);
  });

  // Checks that an issue without a title is rejected
  it("rejects an issue with no title", () => {
    const { title, ...noTitle } = validIssue;
    const result = createIssueSchema.safeParse(noTitle);

    expect(result.success).toBe(false);
  });

  // Checks that an invalid priority is rejected
  it("rejects a priority that is not low, medium or high", () => {
    const result = createIssueSchema.safeParse({
      ...validIssue,
      priority: "urgent",
    });

    expect(result.success).toBe(false);
  });
});

// Tests validation on the POST /issues route
describe("POST /issues", () => {
  it("rejects an empty body with 400 and ValidationFailed", async () => {
    const response = await request(app).post("/issues").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("ValidationFailed");
  });
});
