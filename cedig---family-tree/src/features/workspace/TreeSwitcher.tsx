"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  ChevronDown,
  TreePine,
  Shield,
  Pencil,
  Eye,
  Check,
  PlusCircle,
  Home,
  Users,
} from "lucide-react";
import { useAppStore } from "@/src/store";
import type { TreeInfo } from "@/src/store/slices/authSlice";

export function TreeSwitcher() {
  const router = useRouter();
  const trees = useAppStore((s) => s.trees);
  const familyTreeId = useAppStore((s) => s.familyTreeId);
  const familyTreeName = useAppStore((s) => s.familyTreeName);
  const switchTree = useAppStore((s) => s.switchTree);
  const setShowCreateTreeForm = useAppStore((s) => (s as any).setShowCreateTreeForm);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const ownedTrees = trees.filter((t) => t.role === "Owner");
  const sharedTrees = trees.filter((t) => t.role !== "Owner");

  if (trees.length === 0) return null;

  const currentTree = trees.find((t) => t.id === familyTreeId);

  const getRoleIcon = (role: TreeInfo["role"]) => {
    switch (role) {
      case "Owner": return <Shield className="w-3 h-3 text-bronze" />;
      case "Admin": return <Shield className="w-3 h-3 text-amber-500" />;
      case "Editor": return <Pencil className="w-3 h-3 text-blue-500" />;
      case "Viewer": return <Eye className="w-3 h-3 text-stone-400" />;
    }
  };

  const getRoleLabel = (role: TreeInfo["role"]) => {
    switch (role) {
      case "Owner": return "Owner";
      case "Admin": return "Admin";
      case "Editor": return "Editor";
      case "Viewer": return "Viewer";
    }
  };

  const handleSwitch = (treeId: string) => {
    switchTree(treeId);
    setOpen(false);
  };

  const handleCreateTree = () => {
    setOpen(false);
    router.push("/family-tree");
    setShowCreateTreeForm(true);
  };

  const renderTreeItem = (tree: TreeInfo) => (
    <button
      key={tree.id}
      onClick={() => handleSwitch(tree.id)}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-bronze/5 transition-colors ${
        tree.id === familyTreeId ? "bg-bronze/10" : ""
      }`}
    >
      <span className="w-8 h-8 rounded-lg bg-pine/5 flex items-center justify-center shrink-0">
        <TreePine className="w-4 h-4 text-pine" />
      </span>
      <div className="min-w-0 flex-grow">
        <p className="text-sm font-semibold text-ink truncate">
          {tree.name}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-stone-500">
          {getRoleIcon(tree.role)}
          <span>{getRoleLabel(tree.role)}</span>
        </div>
      </div>
      {tree.id === familyTreeId && (
        <Check className="w-4 h-4 text-bronze shrink-0" />
      )}
    </button>
  );

  const renderTreeList = () => {
    const sections: { label: string; icon: React.ReactNode; items: TreeInfo[] }[] = [];
    if (ownedTrees.length > 0) {
      sections.push({ label: "My Family Trees", icon: <Home className="w-3.5 h-3.5" />, items: ownedTrees });
    }

    if (sharedTrees.length > 0) {
      const groupedShared: { label: string; items: TreeInfo[] }[] = [];
      const editors = sharedTrees.filter((t) => t.role === "Editor" || t.role === "Admin");
      const viewers = sharedTrees.filter((t) => t.role === "Viewer");

      if (editors.length > 0) {
        groupedShared.push({ label: "Editor", items: editors });
      }
      if (viewers.length > 0) {
        groupedShared.push({ label: "Viewer", items: viewers });
      }

      sections.push({ label: "Shared With Me", icon: <Users className="w-3.5 h-3.5" />, items: sharedTrees });
    }

    return (
      <div className="py-1 max-h-[320px] overflow-y-auto">
        {ownedTrees.length === 0 && (
          <div className="px-4 py-4 border-b border-stone-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-bronze/10 flex items-center justify-center shrink-0 mt-0.5">
                <TreePine className="w-4.5 h-4.5 text-bronze" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink mb-1">
                  You don&apos;t own a family tree yet.
                </p>
                <p className="text-[10px] text-stone-500 mb-2 leading-snug">
                  Create your own family tree to preserve your family history.
                </p>
                <button
                  onClick={handleCreateTree}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pine text-white text-[11px] font-bold hover:opacity-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Family Tree
                </button>
              </div>
            </div>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
              {section.icon}
              {section.label}
            </div>
            {section.items.map(renderTreeItem)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bronze/5 border border-bronze/20 hover:bg-bronze/10 transition-colors text-sm font-semibold text-ink cursor-pointer max-w-[220px]"
      >
        <TreePine className="w-4 h-4 text-bronze shrink-0" />
        <span className="truncate">
          {familyTreeName || currentTree?.name || "Select Tree"}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.8 }}
              className="fixed top-[72px] left-4 sm:left-8 w-72 bg-white border border-bronze/20 rounded-2xl shadow-2xl z-[9999] overflow-hidden origin-top-left"
            >
              <div className="px-4 py-3 bg-pine text-white font-display text-sm font-medium border-b border-white/10">
                Ургийн мод солих
              </div>
              {renderTreeList()}
            </motion.div>
          </>,
          document.body,
        )}
    </>
  );
}
