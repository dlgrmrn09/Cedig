"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function ForgotPasswordPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "forgot-password" });
  }, []);

  return <AuthScreen initialViewMode="forgot-password" />;
}
