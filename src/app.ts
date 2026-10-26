// Student Name: Kelsey Richards
// Date: 10/10/2026

import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { requireAuth } from "./middleware/requireAuth.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import issuesRouter from "./routes/issues.js";

// Create and configure the Express application
export const app = express();

// Authentication routes must come before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(requestLogger);

// Public landing page for the Issue Tracker
app.get("/", (req, res) => {
  res.status(200).type("html").send(`
    <h1>Issue Tracker</h1>
    <p>Welcome to the Issue Tracker API!</p>
  `);
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Returns information about the currently signed-in user
app.get("/api/me", requireAuth, (req, res) => {
  res.json(req.user);
});

// Issue routes
app.use("/issues", requireAuth, issuesRouter);

// Error handling
app.use(errorHandler);
