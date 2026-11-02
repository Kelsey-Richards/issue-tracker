import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Create pretend authentication functions for these tests
const getSession = vi.fn();
const userHasPermission = vi.fn();
const setRole = vi.fn();

vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(),
    api: { getSession, userHasPermission, setRole },
  },
}));

// Import our app after setting up the mock
const { app } = await import("../src/app.js");

const signedIn = {
  user: { id: "u1", name: "Dana Dev", role: "developer" },
};

beforeEach(() => {
  getSession.mockReset().mockResolvedValue(signedIn);
  userHasPermission.mockReset();
  setRole.mockReset();
});

describe("permissions", () => {
  it("returns 401 before asking about permissions", async () => {
    getSession.mockResolvedValue(null);

    const res = await request(app)
      .patch("/issues/abc/classify")
      .send({ classification: "approved" });

    expect(res.status).toBe(401);
    expect(userHasPermission).not.toHaveBeenCalled();
  });

  it("returns 403 when the role lacks the permission", async () => {
    // Pretend the user does not have permission
    userHasPermission.mockResolvedValue({ success: false });

    const res = await request(app)
      .patch("/issues/abc/classify")
      .send({ classification: "approved" });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Your role may not issue:classify",
    });
  });

  it("lets the request through when the role has the permission", async () => {
    // Pretend the user has permission
    userHasPermission.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch("/issues/abc/classify")
      .send({ classification: "approved" });

    expect(res.status).toBe(400);
  });

  it("asks about exactly the permission the route needs", async () => {
    // Pretend the user does not have permission
    userHasPermission.mockResolvedValue({ success: false });

    await request(app).delete("/issues/abc");

    expect(userHasPermission).toHaveBeenCalledWith({
      body: {
        userId: "u1",
        permissions: { issue: ["delete"] },
      },
    });
  });

  it("only asks for issue:close when the new status is closed", async () => {
    // Pretend the user does not have closing permission
    userHasPermission.mockResolvedValue({ success: false });

    const closing = await request(app)
      .patch("/issues/abc/status")
      .send({ status: "closed" });

    const working = await request(app)
      .patch("/issues/abc/status")
      .send({ status: "in-progress" });

    expect(closing.status).toBe(403);
    expect(working.status).not.toBe(403);
  });
});

describe("changing a role", () => {
  it("returns 403 when the caller may not set roles", async () => {
    // Pretend the user does not have permission
    userHasPermission.mockResolvedValue({ success: false });

    const res = await request(app)
      .patch("/users/u2/role")
      .send({ role: "developer" });

    expect(res.status).toBe(403);
    expect(setRole).not.toHaveBeenCalled();
  });

  it("rejects a role that is not one of the five", async () => {
    // Pretend the user has permission to change roles
    userHasPermission.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch("/users/u2/role")
      .send({ role: "wizard" });

    expect(res.status).toBe(400);
  });

  it("refuses to let anybody change their own role", async () => {
    // Pretend the user has permission to manage roles
    userHasPermission.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch("/users/u1/role")
      .send({ role: "technicalManager" });

    expect(res.status).toBe(400);
    expect(setRole).not.toHaveBeenCalled();
  });

  it("passes a valid change on to better-auth", async () => {
    // Pretend the user has permission to change roles
    userHasPermission.mockResolvedValue({ success: true });

    // Pretend Better Auth successfully updated the user
    setRole.mockResolvedValue({
      user: { id: "u2", role: "businessAnalyst" },
    });

    const res = await request(app)
      .patch("/users/u2/role")
      .send({ role: "businessAnalyst" });

    expect(res.status).toBe(200);

    expect(setRole.mock.calls[0][0].body).toEqual({
      userId: "u2",
      role: "businessAnalyst",
    });
  });
});
