// Sets up authentication for the Issue Tracker
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "./db.js";

// Makes sure our environment settings exist
function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set - add it to your .env file`);
  }

  return value;
}

// Connect authentication to our MongoDB database
const db = await getDb();

// Set up better-auth with email and password sign-in
export const auth = betterAuth({
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [requireEnv("CLIENT_ORIGIN")],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
});
