"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import AuthScreen from "@/src/features/auth/AuthScreen";

export default function OTPVerificationPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "otp-verification" });
  }, []);

  return <AuthScreen initialViewMode="otp-verification" />;
}
