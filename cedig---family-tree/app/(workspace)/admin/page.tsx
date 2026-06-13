"use client";
import dynamic from "next/dynamic";
import { AdminSkeleton } from "@/src/components/SkeletonLoader";

const AdminDashboard = dynamic(() =>
  import("@/src/features/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
  { ssr: false, loading: () => <AdminSkeleton /> }
);

export default function AdminPage() {
  return <AdminDashboard />;
}
