import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// Fake session checker so we can test signed-in and signed-out users
const getSession = vi.fn();

vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(),
    api: { getSession },
  },
}));

// Load the app after setting up our authentication mock
const { app } = await import("../src/app.js");

describe("authentication", () => {
  it("returns 401 on GET /issues when nobody is signed in", async () => {
    getSession.mockResolvedValue(null);

    const res = await request(app).get("/issues");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Please sign in first" });
  });

  it("returns 401 on GET /api/me when nobody is signed in", async () => {
    getSession.mockResolvedValue(null);

    const res = await request(app).get("/api/me");

    expect(res.status).toBe(401);
  });

  it("returns the signed-in user from GET /api/me", async () => {
    getSession.mockResolvedValue({
      user: { id: "u1", name: "Dana Dev" },
    });

    const res = await request(app).get("/api/me");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      userId: "u1",
      fullName: "Dana Dev",
    });
  });

  it("keeps /health public", async () => {
    getSession.mockResolvedValue(null);

    expect((await request(app).get("/health")).status).toBe(200);
  });
});
