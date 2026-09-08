// Student Name: Kelsey Richards
// Date: 9/6/2026

// Routes for handling issues in the application
import { Router } from "express";
import {
  listIssues,
  getIssueById,
  createIssue,
} from "../controllers/issuesController";

const issuesRouter = Router();

// Route to get all issues
issuesRouter.get("/", listIssues);

// Route to get a specific issue
issuesRouter.get("/:id", getIssueById);

// Route to create a new issue
issuesRouter.post("/", createIssue);

// Export the issuesRouter to be used in other parts of the application
export default issuesRouter;
