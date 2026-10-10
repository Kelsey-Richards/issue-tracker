// Student Name: Kelsey Richards
// Date: 10/10/2026

import express from "express";

import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import issuesRouter from "./routes/issues.js";

// Create and configure the Express application
export const app = express();

app.use(express.json());
app.use(requestLogger);

// Main route
app.get("/", (req, res) => {
  res.json({ message: "Issue Tracker API is running" });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Issue routes
app.use("/issues", issuesRouter);

// Error handling
app.use(errorHandler);
