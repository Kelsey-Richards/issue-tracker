import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { statement } from "../permissions.js";

type Resource = keyof typeof statement;

// Checks whether a user has permission to perform an action
export function requirePermission<R extends Resource>(
  resource: R,
  action: (typeof statement)[R][number],
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await auth.api.userHasPermission({
      body: {
        userId: req.user.userId,
        permissions: { [resource]: [action] },
      },
    });

    // Block the action if the user's role doesn't allow it
    if (!result.success) {
      return res
        .status(403)
        .json({ error: `Your role may not ${resource}:${action}` });
    }

    next();
  };
}
