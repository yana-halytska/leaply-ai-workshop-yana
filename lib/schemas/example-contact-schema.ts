// Example zod schema. Safe to delete once you create your own.
// See .claude/skills/validation/SKILL.md for the pattern.

import { z } from "zod"

export const ExampleContactSchema = z.object({
  name: z.string().min(1, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Please write at least 10 characters").max(2000),
})

export type ExampleContact = z.infer<typeof ExampleContactSchema>
