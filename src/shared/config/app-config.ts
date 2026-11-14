import { env } from "@/env";

export const appConfig = {
  apiUrl: env.NEXT_PUBLIC_API_URL,
  demoData: env.NEXT_PUBLIC_DEMO_DATA,
  topN: 5,
} as const;
