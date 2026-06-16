"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/src/store";
import { waitForAuthReady, ensureFreshToken } from "@/src/lib/firebase";
import { api } from "@/src/lib/api";

export function AuthRestorer() {
  const loadUserData = useAppStore((s) => s.loadUserData);
  const [ready, setReady] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    async function restore() {
      try {
        const firebaseUser = await waitForAuthReady();

        if (!firebaseUser) {
          console.log("[AUTH] No Firebase user, skipping restore");
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
        console.log("[AUTH] Fresh token stored, restoring session...");

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
