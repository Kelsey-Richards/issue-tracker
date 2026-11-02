import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { statement } from "../permissions.js";

type Resource = keyof typeof statement;

// Check whether a user has a specific permission
export async function userCan<R extends Resource>(
  userId: string,
  resource: R,
  action: (typeof statement)[R][number],
): Promise<boolean> {
  const result = await auth.api.userHasPermission({
    body: { userId, permissions: { [resource]: [action] } },
  });

  return result.success;
}

// Block users who do not have the required permission
export function requirePermission<R extends Resource>(
  resource: R,
  action: (typeof statement)[R][number],
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!(await userCan(req.user.userId, resource, action))) {
      return res.status(403).json({
        error: `Your role may not ${resource}:${action}`,
      });
    }

    next();
  };
}
