import { defineConfig } from "vitest/config";

// Load our mock authentication before running tests
export default defineConfig({
  test: {
    setupFiles: ["tests/setup.ts"],
  },
});
