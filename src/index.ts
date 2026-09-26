// Student Name: Kelsey Richards
// Date: 9/25/2026

import "dotenv/config";
import express from "express";
import issuesRouter from "./routes/issues.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getDb } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Set up middleware
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

// Connect to MongoDB, then start the server
async function startServer() {
  try {
    await getDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
