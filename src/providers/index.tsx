"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

export function RootProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
