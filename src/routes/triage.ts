import { Router } from "express";
import { triage } from "../controllers/triageController.js";
import { validateBody } from "../middleware/validate.js";
import { triageInputSchema } from "../schemas/triageSchemas.js";

const triageRouter = Router();

// Checks the issue information before asking the AI for help.
triageRouter.post("/", validateBody(triageInputSchema), triage);

export default triageRouter;
