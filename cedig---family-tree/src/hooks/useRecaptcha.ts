"use client";

import { useState, useCallback, useRef } from "react";
import { executeRecaptcha, isRecaptchaConfigured } from "@/src/lib/recaptcha";

interface UseRecaptchaReturn {
  executeRecaptcha: (action: string) => Promise<string>;
  isVerifying: boolean;
  error: string | null;
  isConfigured: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifyingRef = useRef(false);

  const execute = useCallback(async (action: string): Promise<string> => {
    if (verifyingRef.current) {
      throw new Error("RECAPTCHA_IN_PROGRESS");
    }

    setError(null);
    setIsVerifying(true);
    verifyingRef.current = true;

    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "RECAPTCHA_FAILED";
      setError(message);
      throw err;
    } finally {
      setIsVerifying(false);
      verifyingRef.current = false;
    }
  }, []);

  return {
    executeRecaptcha: execute,
    isVerifying,
    error,
    isConfigured: isRecaptchaConfigured(),
  };
}
