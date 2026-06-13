"use client";
import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar } from "@/src/features/workspace";
import { WorkspaceHeader } from "@/src/features/workspace";
import AddPersonModal from "@/src/components/AddPersonModal";
import ToastToaster from "@/src/components/ToastToaster";
import { TreeSkeleton, BookSkeleton } from "@/src/components/SkeletonLoader";
import { useAppStore } from "@/src/store";

const BiographyView = dynamic(() => import("@/src/features/biography/BiographyView"), { ssr: false, loading: () => <BookSkeleton /> });
const TreeCanvas = dynamic(() => import("@/src/features/tree/TreeCanvas"), { ssr: false, loading: () => <TreeSkeleton /> });

const TAB_MAP: Record<string, string> = {
  "/family-tree": "tree",
  "/biographies": "biographies",
  "/photos": "photos",
  "/documents": "documents",
  "/activity": "activity",
  "/access": "access",
  "/settings": "settings",
  "/pricing": "pricing",
  "/admin": "admin",
  "/people": "biographies",
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isTreePage = pathname === "/family-tree";
  const activePersonId = useAppStore((s) => s.activePersonId);

  useEffect(() => {
    const tab = TAB_MAP[pathname] || "tree";
    useAppStore.setState({ currentView: "workspace", activeWorkspaceTab: tab as any });
  }, [pathname]);

  return (
    <div className="min-h-screen flex text-ink bg-vellum overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <WorkspaceHeader />
        <div className="flex-grow overflow-auto relative bg-[#f7f4ec]">
          <div className={`absolute inset-0 z-0 ${isTreePage ? "block" : "hidden"}`}>
            <TreeCanvas />
          </div>
          <div className={isTreePage ? "hidden" : "p-4 sm:p-6 lg:p-8 relative z-10"}>
            {children}
          </div>
        </div>
      </div>
      <AddPersonModal />
      <ToastToaster />
      {activePersonId && <BiographyView key={activePersonId} />}
    </div>
  );
}
