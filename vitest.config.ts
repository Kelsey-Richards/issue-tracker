import { defineConfig } from "vitest/config";

// Load our mock authentication before running backend tests
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
  },
});
