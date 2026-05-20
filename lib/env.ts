import { z } from "zod"

// Parse and validate environment variables once at startup.
// Add a field here whenever you reference a new process.env.X in code.
// Required vars use .min(1) / .url() etc; optional vars use .optional().
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Example public var (safe to expose to the browser):
  // NEXT_PUBLIC_APP_URL: z.string().url(),

  // Example server-only secret (never NEXT_PUBLIC_):
  // OPENAI_API_KEY: z.string().min(1),
})

export const env = EnvSchema.parse(process.env)
export type Env = z.infer<typeof EnvSchema>
