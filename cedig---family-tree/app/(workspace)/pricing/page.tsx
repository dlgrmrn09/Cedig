"use client";
import dynamic from "next/dynamic";
import { PricingSkeleton } from "@/src/components/SkeletonLoader";

const SubscriptionsView = dynamic(() =>
  import("@/src/features/subscriptions/SubscriptionsView").then((m) => ({ default: m.SubscriptionsView })),
  { ssr: false, loading: () => <PricingSkeleton /> }
);

export default function PricingPage() {
  return <SubscriptionsView />;
}
