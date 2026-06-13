"use client";
import dynamic from "next/dynamic";
import { FormSkeleton } from "@/src/components/SkeletonLoader";

const SettingsView = dynamic(() =>
  import("@/src/features/settings/SettingsView").then((m) => ({ default: m.SettingsView })),
  { ssr: false, loading: () => <FormSkeleton /> }
);

export default function SettingsPage() {
  return <SettingsView />;
}
