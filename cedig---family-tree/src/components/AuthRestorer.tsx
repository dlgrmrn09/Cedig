"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/src/store";
import { waitForAuthReady, ensureFreshToken, handleRedirectResult } from "@/src/lib/firebase";
import { api } from "@/src/lib/api";
import { socialLoginWithBackend } from "@/src/services/authService";

export function AuthRestorer() {
  const loadUserData = useAppStore((s) => s.loadUserData);
  const [ready, setReady] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    async function restore() {
      try {
        const redirectResult = await handleRedirectResult();

        const firebaseUser = await waitForAuthReady();

        if (!firebaseUser) {
          setReady(true);
          return;
        }

        const token = await ensureFreshToken();
        if (!token) {
          console.warn("[AUTH] Could not obtain fresh token");
          setReady(true);
          return;
        }

        api.setToken(token);

        if (redirectResult) {
          const providerId = redirectResult.user.providerData[0]?.providerId;
          const provider = providerId === 'google.com' ? 'google' : providerId === 'facebook.com' ? 'facebook' : null;
          if (provider) {
            try {
              await socialLoginWithBackend(token, provider);
            } catch {
              console.warn('[AUTH] Backend social login sync skipped');
            }
          }
        }

        

        await loadUserData();
      } catch (err) {
        console.error("[AUTH] Session restore failed:", err);
      } finally {
        setReady(true);
      }
    }

    restore();
  }, [loadUserData]);

  return ready ? null : null;
}
