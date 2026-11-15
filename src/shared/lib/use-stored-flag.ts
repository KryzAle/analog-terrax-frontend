"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const readFlag = (key: string) => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return true;
  }
};

const writeFlag = (key: string) => {
  try {
    window.localStorage.setItem(key, "1");
  } catch {}
  listeners.forEach((listener) => listener());
};

export const useStoredFlag = (key: string) => {
  const isSet = useSyncExternalStore(subscribe, () => readFlag(key), () => true);
  return [isSet, () => writeFlag(key)] as const;
};
