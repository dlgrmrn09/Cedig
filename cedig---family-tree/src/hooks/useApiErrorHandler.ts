"use client";

import { useEffect } from "react";
import { setGlobalErrorHandler, ApiRequestError } from "@/src/lib/api";
import { useAppStore } from "@/lib/store";

export function useApiErrorHandler() {
  const addNotification = useAppStore((s) => s.addNotification);

  useEffect(() => {
    setGlobalErrorHandler((error: ApiRequestError) => {
      if (error.status === 401) return;

      addNotification(
        "warn",
        error.status === 0 ? "Connection Error" : "Request Error",
        error.status === 0
          ? "Unable to connect to server. Please check your connection."
          : error.message.length > 100
            ? error.message.substring(0, 100) + "..."
            : error.message,
      );
    });

    return () => setGlobalErrorHandler(null);
  }, [addNotification]);
}
