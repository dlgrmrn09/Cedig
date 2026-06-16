"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Onboarding is now displayed inside workspace layout.
    // Redirect to /family-tree which will show onboarding content when user has no tree.
    router.replace("/family-tree");
  }, [router]);

  return null;
}
