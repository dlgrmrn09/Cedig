"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Bell,
  Menu,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  LogIn,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useRecaptcha } from "@/src/hooks/useRecaptcha";
import { useAppStore } from "@/src/store";
import type { WorkspaceTab } from "@/src/types/common";
import { TreeSwitcher } from "./TreeSwitcher";
import { InvitationCenter } from "./InvitationCenter";

const tabLabels: Record<WorkspaceTab, string> = {
  tree: "Ургийн мод",
  biographies: "Намтар",
  photos: "Зураг",
  documents: "Бичиг баримт",
  access: "Хандалтын удирдлага",
  pricing: "Төлбөрийн мэдээлэл",
  admin: "Админ Хяналтын хэсэг",
  activity: "Үйл ажиллагаа",
  settings: "Системийн тохиргоо",
};

export function WorkspaceHeader() {
  const router = useRouter();
  const {
    activeWorkspaceTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    setMobileSidebarOpen,
    familyTreeCode,
    joinTreeAsync,
    joinTreeAsyncWithCaptcha,
    addNotification,
  } = useAppStore();
  const { executeRecaptcha, isConfigured } = useRecaptcha();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const notifRef = useRef<HTMLButtonElement>(null);
  const joinInputRef = useRef<HTMLInputElement>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleJoinTree = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 5) {
      addNotification(
        "warn",
        "Буруу код",
        "Ургийн модны код хамгийн багадаа 5 тэмдэгт байх ёстой.",
      );
      return;
    }
    setJoinLoading(true);
    try {
      if (isConfigured) {
        const token = await executeRecaptcha("join_tree");
        await joinTreeAsyncWithCaptcha(code, token);
      } else {
        await joinTreeAsync(code);
      }
      addNotification(
        "success",
        "Амжилттай нэгдлээ",
        `"${code}" код ашиглан ургийн модонд нэгдлээ.`,
      );
      setJoinCode("");
      setShowJoinInput(false);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Урилгын код буруу эсвэл хүчингүй байна.";
      addNotification("warn", "Код олдсонгүй", msg);
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <header className="workspace-tophead h-20 min-h-20 max-h-20 border-b border-bronze/20 bg-white/70 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 select-none box-border">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 min-w-0 flex-shrink">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block overflow-hidden min-w-0 flex-shrink max-w-[160px] md:max-w-[240px] lg:max-w-[280px]">
          <h1 className="h4 sm:h3 lg:h2 text-bronze truncate">
            {tabLabels[activeWorkspaceTab]}
          </h1>
        </div>

        {/* Tree Switcher */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 px-2 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-pine/40 hover:bg-pine/5 transition-colors cursor-pointer">
          <TreeSwitcher />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
        {/* Join Tree by Code */}
        {showJoinInput ? (
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2 py-1 shadow-sm">
            <input
              ref={joinInputRef}
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinTree();
                if (e.key === "Escape") {
                  setShowJoinInput(false);
                  setJoinCode("");
                }
              }}
              placeholder="Код оруулах"
              className="w-28 lg:w-36 bg-transparent text-xs text-ink placeholder:text-stone-400 outline-none font-medium uppercase tracking-wider"
              autoFocus
              disabled={joinLoading}
            />
            <button
              onClick={handleJoinTree}
              disabled={joinLoading}
              className="p-1 rounded-lg bg-pine text-white hover:bg-pine/90 transition-colors cursor-pointer disabled:opacity-50"
              title="Нэгдэх"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setShowJoinInput(false);
                setJoinCode("");
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Хаах"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowJoinInput(true);
              setTimeout(() => joinInputRef.current?.focus(), 100);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-stone-300 text-xs font-semibold text-stone-500 hover:text-pine hover:border-pine/40 hover:bg-pine/5 transition-all cursor-pointer whitespace-nowrap"
            title={
              familyTreeCode
                ? `Таны код: ${familyTreeCode}`
                : "Ургийн модны код оруулах"
            }
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Join by code</span>
          </button>
        )}
        {/* Invitation Center */}
        <InvitationCenter />
        <button
          ref={notifRef}
          onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          className="p-2.5 rounded-xl border border-stone-150 hover:bg-stone-50 text-stone-600 relative transition cursor-pointer hover:text-stone-800"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifDropdown &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[9999] cursor-pointer"
                onClick={() => setShowNotifDropdown(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 26,
                  mass: 0.8,
                }}
                className="fixed top-[88px] right-4 sm:right-8 left-4 sm:left-auto w-auto sm:w-96 bg-white border border-bronze/20 rounded-2xl shadow-2xl z-[9999] overflow-hidden text-stone-800 origin-top-right"
              >
                <div className="p-4 bg-pine text-white flex justify-between items-center z-[99]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-bronze" />
                    <span className="font-display font-medium text-sm">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {notifications.length > 0 && (
                  <div className="flex justify-between items-center px-4 py-2 bg-[#FAF6EE] border-b border-stone-100 text-[11px] font-semibold text-ink/80">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="flex items-center gap-1 hover:text-bronze cursor-pointer transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark as Read</span>
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                )}

                <div className="max-h-[320px] overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <div className="text-center p-8 text-stone-400 text-xs space-y-1.5">
                      <Bell className="w-8 h-8 mx-auto text-stone-300 animate-pulse" />
                      <p className="font-bold">Мэдэгдэл байхгүй байна.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex justify-between items-start gap-3 transition-colors ${n.isRead ? "bg-white opacity-60" : "bg-bronze/5"}`}
                      >
                        <div className="flex gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.type === "success" ? "bg-emerald-50 text-emerald-600" : n.type === "warn" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5 text-left">
                            <p className="font-bold text-xs text-ink">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-stone-600 leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-stone-400 block pt-0.5">
                              {n.time}
                            </span>
                          </div>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={() => markNotificationAsRead(n.id)}
                            className="p-1 rounded-full hover:bg-stone-100 text-bronze transition-colors cursor-pointer shrink-0"
                            title="Уншсанд тооцох"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
                  <button
                    onClick={() => {
                      router.push("/activity");
                      setShowNotifDropdown(false);
                    }}
                    className="text-xs font-bold text-ink hover:text-bronze flex items-center justify-center gap-1 mx-auto cursor-pointer transition-colors"
                  >
                    <span>Мэдэгдлийн төв рүү очих</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </>,
            document.body,
          )}
      </div>
    </header>
  );
}
