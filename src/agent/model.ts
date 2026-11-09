import { createGroq } from "@ai-sdk/groq";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set - add it to your .env file`);
  }

  return value;
}

// Connects to Groq only when the AI assistant is needed.
export function getModel() {
  const groq = createGroq({
    apiKey: requireEnv("GROQ_API_KEY"),
    baseURL: process.env.GROQ_BASE_URL,
  });

  return groq(process.env.GROQ_MODEL ?? "openai/gpt-oss-20b");
}
