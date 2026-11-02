import { z } from "zod";
import { roleNames } from "../permissions.js";

// Only allow roles defined in our permission chart
export const setRoleSchema = z.object({
  role: z.enum(roleNames),
});
