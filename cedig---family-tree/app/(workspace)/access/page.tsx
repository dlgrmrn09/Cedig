"use client";
import dynamic from "next/dynamic";
import { AccessSkeleton } from "@/src/components/SkeletonLoader";

const AccessManagement = dynamic(() =>
  import("@/src/features/access/AccessManagement").then((m) => ({ default: m.AccessManagement })),
  { ssr: false, loading: () => <AccessSkeleton /> }
);

export default function AccessPage() {
  return <AccessManagement />;
}
