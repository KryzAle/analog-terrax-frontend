"use client";

import { useState } from "react";
import { useStoredFlag } from "@/shared/lib/use-stored-flag";

const INTRO_SEEN_KEY = "analogterrax:intro-seen";

export const useIntroViewModel = () => {
  const [isSeen, markSeen] = useStoredFlag(INTRO_SEEN_KEY);
  const [isReopened, setIsReopened] = useState(false);

  return {
    isOpen: !isSeen || isReopened,
    open: () => setIsReopened(true),
    close: () => {
      markSeen();
      setIsReopened(false);
    },
  };
};
