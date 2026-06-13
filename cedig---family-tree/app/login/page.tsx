"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function LoginPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "login" });
  }, []);

  return <AuthScreen initialViewMode="login" />;
}
