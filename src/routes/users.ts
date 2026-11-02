import { Router } from "express";
import { APIError } from "better-auth/api";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import { validateBody } from "../middleware/validate.js";
import { setRoleSchema } from "../schemas/userSchemas.js";

export const usersRouter = Router();

usersRouter.patch(
  "/:id/role",
  requirePermission("user", "set-role"),
  validateBody(setRoleSchema),
  async (req, res, next) => {
    // Prevent someone from changing their own role
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ error: "You cannot change your own role" });
    }

    try {
      // Ask Better Auth to assign the new role
      const result = await auth.api.setRole({
        body: {
          userId: req.params.id as string,
          role: req.body.role,
        },
        headers: fromNodeHeaders(req.headers),
      });

      res.json(result);
    } catch (err) {
      // Return Better Auth errors to the user
      if (err instanceof APIError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      next(err);
    }
  },
);
