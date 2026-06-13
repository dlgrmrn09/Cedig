"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import OnboardingScreen from "@/src/components/OnboardingScreen";

export default function OnboardingPage() {
  useEffect(() => {
    useAppStore.setState({ currentView: "onboarding" });
  }, []);

  return <OnboardingScreen />;
}
