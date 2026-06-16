"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  Mail,
  Check,
  X,
  Loader2,
  TreePine,
  Clock,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { useAppStore } from "@/src/store";
import * as inviteApi from "@/src/features/access/api";
import type { PendingInvite, JoinRequest } from "@/src/features/access/types";

type InviteWithState = PendingInvite & {
  _state?: "idle" | "accepting" | "accepted" | "declining" | "error";
  _errorMsg?: string;
};

type JoinRequestWithState = JoinRequest & {
  _state?: "idle" | "approving" | "approved" | "rejecting" | "error";
  _errorMsg?: string;
};

export function InvitationCenter() {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<InviteWithState[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequestWithState[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const addNotification = useAppStore((s) => s.addNotification);
  const setAppState = useAppStore.setState;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [invitesData, joinRequestsData] = await Promise.all([
        inviteApi.fetchPendingInvites().catch(() => []),
        inviteApi.fetchPendingJoinRequestsForOwner().catch(() => []),
      ]);
      setInvites((invitesData || []).map((i) => ({ ...i, _state: "idle" as const })));
      setJoinRequests((joinRequestsData || []).map((r) => ({ ...r, _state: "idle" as const })));
    } catch {
      setError("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchAll();
    }
  }, [open, fetchAll]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const isInsideTrigger = ref.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);
      if (!isInsideTrigger && !isInsideDropdown) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // ---- Invite handlers ----
  const handleAccept = async (inviteId: string) => {
    setInvites((prev) =>
      prev.map((i) => (i.id === inviteId ? { ...i, _state: "accepting" as const } : i))
    );
    try {
      const result = await inviteApi.acceptInvite(inviteId);
      setInvites((prev) =>
        prev.map((i) => (i.id === inviteId ? { ...i, _state: "accepted" as const } : i))
      );
      const invite = invites.find((i) => i.id === inviteId);
      if (invite && result?.treeId) {
        const state = useAppStore.getState();
        const existingTrees = state.trees;
        const alreadyHasTree = existingTrees.some((t) => t.id === result.treeId);
        if (!alreadyHasTree) {
          const newTree = {
            id: result.treeId,
            name: invite.treeName,
            code: invite.treeCode,
            role: (result.role as "Owner" | "Admin" | "Editor" | "Viewer") || "Viewer",
          };
          setAppState({ trees: [...existingTrees, newTree] });
          if (!state.familyTreeId) {
            useAppStore.getState().switchTree(result.treeId);
          }
        }
      }
      addNotification("success", "Урилга хүлээж авлаа",
        `Та "${invite?.treeName || 'ургийн мод'}"-д ${invite?.role === 'Editor' ? 'Editor' : 'Viewer'} эрхтэйгээр нэвтрэх боломжтой боллоо.`);
      const timer = setTimeout(() => {
        setInvites((prev) => prev.filter((i) => i.id !== inviteId));
        timersRef.current.delete(inviteId);
      }, 2000);
      timersRef.current.set(inviteId, timer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Accept failed";
      setInvites((prev) =>
        prev.map((i) => i.id === inviteId ? { ...i, _state: "error" as const, _errorMsg: msg } : i));
      addNotification("warn", "Алдаа", msg);
    }
  };

  const handleDecline = async (inviteId: string) => {
    setInvites((prev) =>
      prev.map((i) => (i.id === inviteId ? { ...i, _state: "declining" as const } : i)));
    try {
      await inviteApi.declineInvite(inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      addNotification("info", "Урилгаас татгалзлаа", "Та урилгыг цуцаллаа.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Decline failed";
      setInvites((prev) =>
        prev.map((i) => i.id === inviteId ? { ...i, _state: "error" as const, _errorMsg: msg } : i));
      addNotification("warn", "Алдаа", msg);
    }
  };

  // ---- Join request handlers ----
  const handleApprove = async (requestId: string, treeId: string) => {
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, _state: "approving" as const } : r)));
    try {
      await inviteApi.approveJoinRequest(treeId, requestId);
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, _state: "approved" as const } : r)));
      addNotification("success", "Хүсэлт зөвшөөрөгдлөө", "Хэрэглэгч ургийн модны гишүүн боллоо.");
      const timer = setTimeout(() => {
        setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
        timersRef.current.delete(requestId);
      }, 2000);
      timersRef.current.set(requestId, timer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Approve failed";
      setJoinRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, _state: "error" as const, _errorMsg: msg } : r));
      addNotification("warn", "Алдаа", msg);
    }
  };

  const handleReject = async (requestId: string, treeId: string) => {
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, _state: "rejecting" as const } : r)));
    try {
      await inviteApi.rejectJoinRequest(treeId, requestId);
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      addNotification("info", "Хүсэлт цуцлагдлаа", "Нэгдэх хүсэлтээс татгалзлаа.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reject failed";
      setJoinRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, _state: "error" as const, _errorMsg: msg } : r));
      addNotification("warn", "Алдаа", msg);
    }
  };

  const invitePendingCount = invites.filter((i) => i._state === "idle" || i._state === "error").length;
  const joinPendingCount = joinRequests.filter((r) => r._state === "idle" || r._state === "error").length;
  const pendingCount = invitePendingCount + joinPendingCount;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("mn-MN", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch { return dateStr; }
  };

  const renderInviteCard = (inv: InviteWithState) => {
    const isAccepting = inv._state === "accepting";
    const isAccepted = inv._state === "accepted";
    const isDeclining = inv._state === "declining";
    const isError = inv._state === "error";
    const isActing = isAccepting || isAccepted || isDeclining;

    return (
      <div key={inv.id} className={`p-4 space-y-3 transition-colors ${isAccepted ? "bg-emerald-50/50" : isError ? "bg-red-50/30" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isAccepted ? "bg-emerald-100 text-emerald-600" : isError ? "bg-red-100 text-red-500" : "bg-bronze/10 text-bronze"
          }`}>
            {isAccepted ? <CheckCircle2 className="w-4.5 h-4.5" /> : <TreePine className="w-4.5 h-4.5" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm font-bold text-ink">{inv.treeName}</p>
            {isAccepted ? (
              <p className="text-xs text-emerald-600 font-medium mt-1">Та "{inv.treeName}" ургийн модонд нэвтрэх боломжтой боллоо.</p>
            ) : isError ? (
              <p className="text-xs text-red-600 mt-1">{inv._errorMsg || "Алдаа гарлаа. Дахин оролдоно уу."}</p>
            ) : (
              <p className="text-xs text-stone-500 mt-0.5">
                {(inv as any).inviterName || (inv.invitedBy ? `${inv.invitedBy.displayName || inv.invitedBy.username}` : "Уригдсан")} &middot; {inv.role === "Editor" ? "Editor" : "Viewer"}
              </p>
            )}
            {inv.createdAt && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400"><Clock className="w-3 h-3" /><span>{formatDate(inv.createdAt)}</span></div>
            )}
          </div>
        </div>
        {isAccepted ? (
          <div className="flex items-center justify-center gap-2 py-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /><span>Амжилттай нэгдлээ</span></div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => handleAccept(inv.id)} disabled={isActing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-pine text-white text-xs font-bold hover:opacity-95 transition disabled:opacity-50 cursor-pointer">
              {isAccepting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {isError ? "Дахин оролдох" : "Зөвшөөрөх"}
            </button>
            <button onClick={() => handleDecline(inv.id)} disabled={isActing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition disabled:opacity-50 cursor-pointer">
              {isDeclining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              Татгалзах
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderJoinRequestCard = (req: JoinRequestWithState) => {
    const isApproving = req._state === "approving";
    const isApproved = req._state === "approved";
    const isRejecting = req._state === "rejecting";
    const isError = req._state === "error";
    const isActing = isApproving || isApproved || isRejecting;

    return (
      <div key={req.id} className={`p-4 space-y-3 transition-colors ${isApproved ? "bg-emerald-50/50" : isError ? "bg-red-50/30" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isApproved ? "bg-emerald-100 text-emerald-600" : isError ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-600"
          }`}>
            {isApproved ? <CheckCircle2 className="w-4.5 h-4.5" /> : <UserPlus className="w-4.5 h-4.5" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm font-bold text-ink">{req.displayName || req.username}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              Хүсэлт илгээсэн: <span className="font-semibold">{(req as any).treeName || req.code}</span>
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">@{req.username} &middot; {req.code}</p>
            {isApproved ? (
              <p className="text-xs text-emerald-600 font-medium mt-1">Нэгдэх хүсэлт зөвшөөрөгдлөө.</p>
            ) : isError ? (
              <p className="text-xs text-red-600 mt-1">{req._errorMsg || "Алдаа гарлаа."}</p>
            ) : null}
            {req.createdAt && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400"><Clock className="w-3 h-3" /><span>{formatDate(req.createdAt)}</span></div>
            )}
          </div>
        </div>
        {isApproved ? (
          <div className="flex items-center justify-center gap-2 py-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /><span>Зөвшөөрөгдлөө</span></div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => handleApprove(req.id, req.treeId)} disabled={isActing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer">
              {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {isError ? "Дахин оролдох" : "Зөвшөөрөх"}
            </button>
            <button onClick={() => handleReject(req.id, req.treeId)} disabled={isActing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition disabled:opacity-50 cursor-pointer">
              {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              Татгалзах
            </button>
          </div>
        )}
      </div>
    );
  };

  const hasContent = invites.length > 0 || joinRequests.length > 0;

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl border border-stone-150 hover:bg-stone-50 text-stone-600 relative transition cursor-pointer hover:text-stone-800"
      >
        <Mail className="w-4.5 h-4.5" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] cursor-default" onClick={() => setOpen(false)} />
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            onClick={(e) => e.stopPropagation()}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.8 }}
            className="fixed top-[88px] right-4 sm:right-8 left-4 sm:left-auto w-auto sm:w-96 bg-white border border-bronze/20 rounded-2xl shadow-2xl z-[9999] overflow-hidden text-stone-800 origin-top-right"
          >
            <div className="px-4 py-3 bg-pine text-white font-display text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-bronze" />
              <span>Урилгууд</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-stone-400 animate-spin" /></div>
              ) : error ? (
                <div className="text-center py-8 text-stone-400 text-sm">
                  <p>{error}</p>
                  <button onClick={fetchAll} className="text-bronze font-bold mt-2 hover:underline">Try again</button>
                </div>
              ) : !hasContent ? (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <Mail className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-sm font-semibold">Урилга байхгүй</p>
                  <p className="text-xs">Танд хүлээгдэж буй урилга байхгүй байна.</p>
                </div>
              ) : (
                <div>
                  {joinRequests.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border-b border-amber-100">
                        Нэгдэх хүсэлтүүд ({joinPendingCount})
                      </div>
                      <div className="divide-y divide-stone-100">
                        {joinRequests.map(renderJoinRequestCard)}
                      </div>
                    </div>
                  )}
                  {invites.length > 0 && (
                    <div>
                      {joinRequests.length > 0 && (
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 border-b border-stone-100">
                          Урилгууд ({invitePendingCount})
                        </div>
                      )}
                      <div className="divide-y divide-stone-100">
                        {invites.map(renderInviteCard)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>,
        document.body,
      )}
    </>
  );
}
