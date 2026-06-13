"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function AuthSuccessPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "auth-success" });
  }, []);

  return <AuthScreen initialViewMode="auth-success" />;
}
