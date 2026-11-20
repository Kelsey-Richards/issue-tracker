import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import issuesRouter from "./routes/issues.js";
import triageRouter from "./routes/triage.js";
import { usersRouter } from "./routes/users.js";
import path from "node:path";

// Create and configure the Express application
export const app = express();

// Authentication routes must come before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(requestLogger);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Returns information about the currently signed-in user
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ ...req.user, role: req.role });
});

// Issue routes
app.use("/issues", requireAuth, issuesRouter);

// Allow signed-in users to request AI suggestions
app.use("/triage", requireAuth, triageRouter);

// Require users to sign in before accessing user routes
app.use("/users", requireAuth, usersRouter);

// Serve the built React frontend
const dist = path.join(import.meta.dirname, "../frontend/dist");
app.use(express.static(dist));

// Send React's index.html for page addresses not handled by the API
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

// Error handling
app.use(errorHandler);
