import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_DEMO_DATA: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  NEXT_PUBLIC_DEMO_DATA: process.env.NEXT_PUBLIC_DEMO_DATA || undefined,
});
