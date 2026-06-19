"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar, WorkspaceHeader, OnboardingPlaceholder } from "@/src/features/workspace";
import AddPersonModal from "@/src/components/AddPersonModal";
import ToastToaster from "@/src/components/ToastToaster";
import { TreePine } from "lucide-react";
import { TreeSkeleton, BookSkeleton } from "@/src/components/SkeletonLoader";
import { useAppStore } from "@/src/store";
import { fetchAllPeople } from "@/src/services/memberService";
import { fetchNotifications } from "@/src/services/notificationService";
import { fetchActivities } from "@/src/services/activityService";
import { fetchMediaForTree } from "@/src/services/mediaService";
import { useApiErrorHandler } from "@/src/hooks/useApiErrorHandler";

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

const TREE_DEPENDENT_ROUTES = [
  "/biographies", "/photos", "/documents", "/people", "/access",
];

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isTreePage = pathname === "/family-tree";
  const activePersonId = useAppStore((s) => s.activePersonId);
  const familyTreeId = useAppStore((s) => s.familyTreeId);
  const trees = useAppStore((s) => s.trees);
  const loadedTreeIdRef = useRef<string | null>(null);

  const hasActiveTree = !!familyTreeId;
  const ownedTreeCount = trees.filter((t) => t.role === 'Owner').length;
  const hasAnyTree = trees.length > 0;
  const showCreateTreeForm = useAppStore((s) => (s as any).showCreateTreeForm);
  const setShowCreateTreeForm = useAppStore((s) => (s as any).setShowCreateTreeForm);
  const isTreeDependent = TREE_DEPENDENT_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    setShowCreateTreeForm(false);
  }, [familyTreeId]);

  useApiErrorHandler();

  useEffect(() => {
    const tab = TAB_MAP[pathname] || "tree";
    useAppStore.setState({ currentView: "workspace", activeWorkspaceTab: tab as any });
  }, [pathname]);

  useEffect(() => {
    if (!familyTreeId || familyTreeId === loadedTreeIdRef.current) return;

    loadedTreeIdRef.current = familyTreeId;
    const currentTreeId = familyTreeId;
    let cancelled = false;

    async function loadWorkspaceData() {
      try {
        const [people, notifications, activities, media] = await Promise.all([
          fetchAllPeople(currentTreeId).catch(() => []),
          fetchNotifications().catch(() => []),
          fetchActivities(currentTreeId, { limit: 100 }).then(r => r.activities).catch(() => []),
          fetchMediaForTree(currentTreeId).catch(() => []),
        ]);

        if (cancelled) return;

        useAppStore.setState({
          people: people,
          peopleLoaded: true,
          notifications: notifications,
          activities: activities,
          media: media,
        });
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load workspace data:', error);
        }
      }
    }

    loadWorkspaceData();
    return () => { cancelled = true; };
  }, [familyTreeId]);

  return (
    <div className="min-h-screen flex text-ink bg-vellum overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <WorkspaceHeader />
        <div className="flex-grow overflow-auto relative bg-[#f7f4ec]">
          {(!hasActiveTree && isTreePage) || showCreateTreeForm ? (
            <div className="p-4 sm:p-6 lg:p-8 relative z-10">
              <OnboardingPlaceholder hasAnyTree={hasAnyTree} />
            </div>
          ) : hasActiveTree ? (
            <>
              {isTreePage && ownedTreeCount === 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white/95 backdrop-blur border border-bronze/30 rounded-xl px-5 py-3 shadow-lg flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-bronze/10 flex items-center justify-center shrink-0">
                      <TreePine className="w-4 h-4 text-bronze" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">
                        Та одоо өөр хүний ургийн модыг үзэж байна.
                      </p>
                      <p className="text-[10px] text-stone-500">
                        Өөрийн модоо үүсгэхийн тулд энд дарна уу.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateTreeForm(true)}
                      className="px-3 py-1.5 rounded-lg bg-pine text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Мод үүсгэх
                    </button>
                  </div>
                </div>
              )}
              <div className={`absolute inset-0 z-0 ${isTreePage ? "block" : "hidden"}`}>
                <TreeCanvas />
              </div>
              <div className={isTreePage ? "hidden" : "p-4 sm:p-6 lg:p-8 relative z-10"}>
                {children}
              </div>
            </>
          ) : isTreeDependent ? (
            <div className="p-4 sm:p-6 lg:p-8 relative z-10 flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-bronze/10 flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-bronze" />
                </div>
                <h3 className="text-lg font-display font-bold text-ink mb-2">
                  Ургийн мод шаардлагатай
                </h3>
                <p className="text-sm text-ink/60 mb-6 leading-relaxed">
                  Энэ хэсэгт хандахын тулд та эхлээд ургийн мод үүсгэх эсвэл урилгаар нэгдэх шаардлагатай.
                </p>
                <button
                  onClick={() => router.push("/family-tree")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-pine text-white rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-lg"
                >
                  <TreePine className="w-4 h-4 text-bronze" />
                  Ургийн мод үүсгэх
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 relative z-10">
              {children}
            </div>
          )}
        </div>
      </div>
      <AddPersonModal />
      <ToastToaster />
      {activePersonId && hasActiveTree && <BiographyView key={activePersonId} />}
    </div>
  );
}
