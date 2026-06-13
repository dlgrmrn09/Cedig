"use client";
import { useRouter } from "next/navigation";
import Logo from "@/src/components/Logo";
import React, { useState, useEffect } from "react";
import { useAppStore } from "@/src/store";
import { motion, AnimatePresence } from "motion/react";
import {
  Users2,
  BookOpen,
  FileText,
  Share2,
  Settings,
  Clock,
  CreditCard,
  LogOut,
  User,
  Image as ImageIcon,
  X,
} from "lucide-react";

const TAB_ROUTES: Record<string, string> = {
  tree: "/family-tree",
  biographies: "/biographies",
  photos: "/photos",
  documents: "/documents",
  activity: "/activity",
  access: "/access",
  settings: "/settings",
  pricing: "/pricing",
  admin: "/admin",
};

export default function Sidebar() {
  const router = useRouter();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isSidebarCollapsed = !isSidebarHovered;

  const activeWorkspaceTab = useAppStore((s) => s.activeWorkspaceTab);
  const setWorkspaceTab = useAppStore((s) => s.setWorkspaceTab);
  const familyTreeName = useAppStore((s) => s.familyTreeName);
  const familyTreeCode = useAppStore((s) => s.familyTreeCode);
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const isMobileSidebarOpen = useAppStore((s) => s.isMobileSidebarOpen);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [isMobileSidebarOpen]);

  const navItems: {
    id: string;
    icon: React.ReactNode;
    label: string;
    title: string;
  }[] = [
    {
      id: "tree",
      icon: <Users2 className="w-4 h-4 shrink-0" />,
      label: "Tree",
      title: "Tree",
    },
    {
      id: "biographies",
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      label: "Biographies",
      title: "Biographies",
    },
    {
      id: "photos",
      icon: <ImageIcon className="w-4 h-4 shrink-0" />,
      label: "Photos",
      title: "Photos",
    },
    {
      id: "documents",
      icon: <FileText className="w-4 h-4 shrink-0" />,
      label: "Documents",
      title: "Documents",
    },
    {
      id: "access",
      icon: <Share2 className="w-4 h-4 shrink-0" />,
      label: "Access",
      title: "Access",
    },
    {
      id: "settings",
      icon: <Settings className="w-4 h-4 shrink-0" />,
      label: "Settings",
      title: "Settings",
    },
    {
      id: "activity",
      icon: <Clock className="w-4 h-4 shrink-0" />,
      label: "Activity",
      title: "Activity",
    },
    {
      id: "pricing",
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
      label: "Pricing",
      title: "Pricing",
    },
  ];

  const handleNavClick = (id: string) => {
    setWorkspaceTab(id as any);
    const route = TAB_ROUTES[id];
    if (route) router.push(route);
    if (isMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  const renderSidebarContent = (expanded: boolean) => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div
          className={`border-b border-white/10 flex items-center transition-all duration-300 ${!expanded ? "p-4 justify-center" : "p-6 gap-3"}`}
        >
          <div className="relative w-16 h-16  shrink-0">
            <Logo size={64} />
          </div>
          {expanded && (
            <div className="truncate overflow-hidden whitespace-nowrap">
              <span className="text-xl text-vellum tracking-widest uppercase">
                CEDIG
              </span>
              <p className="caption text-bronze font-bold tracking-tight uppercase leading-none mt-0.5">
                Stemma
              </p>
            </div>
          )}
        </div>

        <div
          className={`border-b border-white/5 bg-white/5 flex items-center transition-all duration-300 ${!expanded ? "p-3 justify-center" : "px-6 py-4 justify-between"}`}
        >
          {expanded && (
            <div className="truncate overflow-hidden whitespace-nowrap pr-1">
              <p className="caption text-white font-bold truncate">
                {familyTreeName || "Sartuul Lineage"}
              </p>
            </div>
          )}
          <span
            className="text-[9px] px-1.5 py-0.5 rounded bg-bronze/20 text-bronze font-mono font-bold shrink-0"
            title={familyTreeName || "Sartuul Lineage"}
          >
            {familyTreeCode || "SA-01"}
          </span>
        </div>

        <nav
          className={`space-y-1.5 text-xs font-semibold transition-all duration-300 ${!expanded ? "p-2" : "p-4"}`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`sidebar-${item.id}-tab`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center rounded-xl transition cursor-pointer ${!expanded ? "p-3 justify-center" : "py-3 px-4"} ${
                activeWorkspaceTab === item.id
                  ? "bg-bronze text-ink"
                  : "text-vellum/70 hover:bg-white/5 hover:text-white"
              }`}
              title={!expanded ? item.label : undefined}
            >
              {item.icon}
              {expanded && (
                <span className="ml-3 truncate whitespace-nowrap overflow-hidden caption font-semibold">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div
        className={`border-t border-white/10 space-y-4 transition-all duration-300 mt-auto ${!expanded ? "p-2" : "p-4"}`}
      >
        <div
          className={
            `flex items-center justify-center ` +
            (expanded ? "justify-start" : "")
          }
        >
          <div className="w-10 h-10 rounded-full border border-bronze overflow-hidden bg-stone-700 flex items-center justify-center relative shrink-0">
            <User className="w-5 h-5 text-stone-200" />
          </div>
          {expanded && (
            <div className="truncate overflow-hidden whitespace-nowrap ml-3">
              <p className="caption text-white font-bold truncate">
                {user?.name || "Баатар М."}
              </p>
              <span className="caption text-bronze font-bold uppercase tracking-wider block">
                {user?.role || "Owner"}
              </span>
            </div>
          )}
        </div>

        <button
          id="workspace-logout-btn"
          onClick={logout}
          className={`w-full bg-white/5 hover:bg-white/10 text-white/80 rounded-xl font-bold flex items-center justify-center text-xs border border-white/10 cursor-pointer transition-all duration-300 ${!expanded ? "p-2.5" : "py-2.5 px-4"}`}
          title={!expanded ? "Системээс гарах" : undefined}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {expanded && (
            <span className="ml-2 truncate overflow-hidden whitespace-nowrap">
              Системээс гарах
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-pine text-vellum flex flex-col z-50 border-r-[5px] border-bronze overflow-hidden lg:hidden"
          >
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-vellum/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - hidden on mobile */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className="hidden lg:flex bg-pine text-vellum flex-col justify-between shrink-0 h-screen border-r-[5px] border-bronze z-50 overflow-hidden relative"
      >
        {renderSidebarContent(!isSidebarCollapsed)}
      </motion.aside>
    </>
  );
}
