// Student Name: Kelsey Richards
// Date: 9/6/2026

// This is a simple Express server that responds to health check requests.
import express from "express";

// Import the issuesRouter from the routes directory to handle issue-related routes
import issuesRouter from "./routes/issues";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = 3000;

// Use the issuesRouter for all routes starting with /issues
app.use("/issues", issuesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
