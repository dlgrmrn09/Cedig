"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store";
import LandingPage from "@/src/features/landing/LandingPage";

export default function Home() {
  useEffect(() => {
    useAppStore.setState({ currentView: "landing" });
  }, []);

  return <LandingPage />;
}
