"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { useAppStore } from "@/src/store";
import { onAuthStateChange } from "@/src/lib/firebase";

function getSocketUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return apiUrl.replace(/\/api\/v1$/, "").replace(/\/+$/, "");
}

let socketInstance: Socket | null = null;

export function SocketProvider({ children }: { children: ReactNode }) {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function connect(user: any) {
      try {
        const token = await user.getIdToken();
        if (!token) return;

        if (socketInstance?.connected) return;

        if (socketInstance) {
          socketInstance.auth = { token };
          socketInstance.connect();
        } else {
          const url = getSocketUrl();

          socketInstance = io(url, {
            auth: { token },
            transports: ["websocket", "polling"],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
          });
        }

        socketInstance.on("connect", () => {
          if (!mountedRef.current) return;
        });

        socketInstance.on("disconnect", (reason) => {
          if (!mountedRef.current) return;
        });

        socketInstance.on("connect_error", (err) => {
          if (!mountedRef.current) return;
          console.error("[SOCKET] Connect error:", err.message);
        });

        socketInstance.on("notification:new", (notification: any) => {
          if (!mountedRef.current) return;
          const store = useAppStore.getState();
          store.addNotification(
            notification.type || "info",
            notification.title || "",
            notification.message || "",
          );
        });

        socketInstance.on("notification:updated", (data: any) => {
          if (!mountedRef.current) return;
          const store = useAppStore.getState();
          store.markNotificationAsRead(data.id);
        });

        socketInstance.on("notifications:read-all", () => {
          if (!mountedRef.current) return;
          const store = useAppStore.getState();
          store.markAllNotificationsAsRead();
        });
      } catch (err) {
        console.error("[SOCKET] Init failed:", err);
      }
    }

    function disconnect() {
      if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketInstance = null;
      }
    }

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        connect(user);
      } else {
        disconnect();
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
      disconnect();
    };
  }, []);

  return <>{children}</>;
}
