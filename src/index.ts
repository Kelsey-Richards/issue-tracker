// Student Name: Kelsey Richards
// Date: 9/6/2026

// This is a simple Express server that responds to health check requests.
import express from "express";

// Import the issuesRouter from the routes directory to handle issue-related routes
import issuesRouter from "./routes/issues";

// Import the requestLogger middleware to log incoming HTTP requests
import { requestLogger } from "./middleware/logger";

// Import the errorHandler middleware to handle errors in the application
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Use the express.json() middleware to parse incoming JSON requests
app.use(express.json());
app.use(requestLogger);

// Define a health check endpoint that responds with a status of "ok" when accessed
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Use the issuesRouter for all routes starting with "/issues" and the errorHandler for handling errors
app.use("/issues", issuesRouter);
app.use(errorHandler);

const PORT = 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
