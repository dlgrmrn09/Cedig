"use client";
import dynamic from "next/dynamic";
import { ActivitySkeleton } from "@/src/components/SkeletonLoader";

const ActivityTimeline = dynamic(() =>
  import("@/src/features/activity/ActivityTimeline").then((m) => ({ default: m.ActivityTimeline })),
  { ssr: false, loading: () => <ActivitySkeleton /> }
);

export default function ActivityPage() {
  return <ActivityTimeline />;
}
