"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

export const RootProviders = ({ children }: { children: ReactNode }) => (
  <QueryProvider>{children}</QueryProvider>
);
