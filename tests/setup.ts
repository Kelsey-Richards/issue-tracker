import { vi } from "vitest";

// Pretend authentication is successful during tests
vi.mock("../src/auth.js", () => ({
  auth: {
    handler: vi.fn(async () => new Response(null, { status: 404 })),
    api: {
      // Simulate a signed-in user
      getSession: vi.fn().mockResolvedValue({
        user: {
          id: "6aad780ce470879405ff14af",
          name: "Miyabi Hoshimi",
        },
      }),
    },
  },
}));
