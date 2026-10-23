import { vi } from "vitest";

// Use fake authentication during automated tests
// This prevents tests from needing real secrets or MongoDB
vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(async () => new Response(null, { status: 404 })),
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));
