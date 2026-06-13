"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function ResetPasswordPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "reset-password" });
  }, []);

  return <AuthScreen initialViewMode="reset-password" />;
}
