// Student Name: Kelsey Richards
// Date: 9/6/2026

// Routes for handling issues in the application
import { Router } from "express";
import { issues, getNextId } from "../data/issues";

const issuesRouter = Router();

// Route to get all issues
issuesRouter.get("/", (req, res) => {
  res.status(200).json(issues);
});

// Route to get a specific issue
issuesRouter.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const issue = issues.find((issue) => issue.id === id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    next(err);
  }
});

// Route to create a new issue
issuesRouter.post("/", (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  const newIssue = {
    id: getNextId(),
    title,
    description,
    status: "open" as const,
    priority: priority || "medium",
  };

  issues.push(newIssue);

  res.status(201).json(newIssue);
});

// Export the issuesRouter to be used in other parts of the application
export default issuesRouter;
