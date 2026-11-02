import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

// All the available permissions in our Issue Tracker
export const statement = {
  ...defaultStatements,
  issue: ["create", "classify", "close", "assign", "delete"],
  comment: ["create", "deleteAny"],
  testCase: ["create", "setResult"],
  timeLog: ["create"],
} as const;

export const ac = createAccessControl(statement);

// Each role only gets the permissions it needs
export const roles = {
  developer: ac.newRole({
    issue: ["create"],
    comment: ["create"],
    timeLog: ["create"],
  }),

  businessAnalyst: ac.newRole({
    issue: ["create", "classify", "close", "assign"],
    comment: ["create"],
  }),

  qualityAnalyst: ac.newRole({
    issue: ["create"],
    comment: ["create"],
    testCase: ["create", "setResult"],
  }),

  productManager: ac.newRole({
    issue: ["create", "assign"],
    comment: ["create"],
  }),

  technicalManager: ac.newRole({
    issue: ["create", "assign"],
    comment: ["create"],
    user: ["set-role"],
  }),
};

export type RoleName = keyof typeof roles;
export const roleNames = Object.keys(roles) as [RoleName, ...RoleName[]];

// Roles that can be assigned to an issue
export const assignableRoles = [
  "developer",
  "businessAnalyst",
  "qualityAnalyst",
] as const satisfies readonly RoleName[];
