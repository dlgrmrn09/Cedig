"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function RegisterPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "register" });
  }, []);

  return <AuthScreen initialViewMode="register" />;
}
