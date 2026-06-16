"use client";

import React, { useState } from "react";
import { useAppStore } from "@/src/store";
import {
  Users,
  UserMinus,
  Eye,
  Pencil,
  Check,
  X,
  Search,
  Loader2,
  Shield,
  UserPlus,
  Copy,
} from "lucide-react";
import { useFamilyTree, useMembers, useUserSearch, useInviteMember, useJoinRequests } from "./hooks";
import type { TreeMember } from "./types";
import Avatar from "@/src/components/shared/Avatar";

const ROLE_OPTIONS = [
  { value: "Admin" as const, label: "Админ", icon: Shield },
  { value: "Editor" as const, label: "Засварлагч", icon: Pencil },
  { value: "Viewer" as const, label: "Үзэгч", icon: Eye },
];

function SkeletonRow() {
  return (
    <div className="p-4 border border-stone-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white animate-pulse">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-stone-200 shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3 w-24 bg-stone-200 rounded" />
          <div className="h-2.5 w-16 bg-stone-100 rounded" />
        </div>
      </div>
      <div className="h-5 w-16 bg-stone-100 rounded shrink-0" />
    </div>
  );
}

export function AccessManagement() {
  const { user, familyTreeId, addNotification } = useAppStore();

  const { tree, loading: treeLoading } = useFamilyTree(familyTreeId);
  const {
    members,
    loading: membersLoading,
    updatingRole,
    changeRole,
    remove: removeMemberApi,
    refetch: refetchMembers,
  } = useMembers(familyTreeId);
  const { query, results, searching, search, clear: clearSearch } = useUserSearch();
  const { inviting, invite } = useInviteMember(familyTreeId);
  const { requests: joinRequests, acting, approve: approveRequest, reject: rejectRequest, pendingCount } = useJoinRequests(familyTreeId);

  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string; displayName: string } | null>(null);
  const [inviteRole, setInviteRole] = useState<"Editor" | "Viewer">("Editor");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const owner = members.find((m) => m.role === "Owner");
  const otherMembers = members.filter((m) => m.role !== "Owner");
  const currentUserMember = members.find((m) => m.userId === user?.id);
  const isOwner = currentUserMember?.role === "Owner";
  const isAdmin = isOwner || currentUserMember?.role === "Admin";

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedUser(null);
    const trimmed = val.startsWith("@") ? val.slice(1) : val;
    if (trimmed.length >= 2) {
      search(trimmed);
    } else {
      clearSearch();
    }
  };

  const handleSelectUser = (u: { id: string; username: string; displayName: string }) => {
    setSelectedUser(u);
    clearSearch();
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      addNotification("warn", "Хэрэглэгч сонгоно уу", "@username оруулж хэрэглэгчийг хайна уу.");
      return;
    }
    try {
      await invite(selectedUser.id, inviteRole);
      addNotification("success", "Урилга илгээгдлээ", `${selectedUser.displayName} хэрэглэгчид "${inviteRole === 'Editor' ? 'Засварлагч' : 'Үзэгч'}" эрхтэй урилга илгээгдлээ.`);
      setSelectedUser(null);
      clearSearch();
      setInviteRole("Editor");
      refetchMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Урилга илгээхэд алдаа гарлаа";
      addNotification("warn", "Алдаа", msg);
    }
  };

  const handleChangeRole = async (member: TreeMember, newRole: "Admin" | "Editor" | "Viewer") => {
    setChangingRoleId(null);
    try {
      await changeRole(member.userId, newRole);
      addNotification("success", "Эрх шинэчлэгдлээ", `${member.displayName || member.email} → ${newRole}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Эрх солиход алдаа гарлаа";
      addNotification("warn", "Алдаа", msg);
    }
  };

  const handleRemoveMember = async (member: TreeMember) => {
    setConfirmDelete(null);
    try {
      await removeMemberApi(member.userId);
      addNotification("success", "Устгагдлаа", `${member.displayName || member.email} гишүүний эрх цуцлагдлаа.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Гишүүнийг хасахад алдаа гарлаа";
      addNotification("warn", "Алдаа", msg);
    }
  };

  const handleCopyCode = () => {
    if (tree?.code) {
      navigator.clipboard.writeText(tree.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="access-workspace"
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-8"
    >
      <div>
        <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
          <Users className="w-5 h-5 text-bronze" /> Гишүүдийн хяналт ба Нууцлал
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Invite Code Section */}
        <div className="p-5 rounded-2xl bg-vellum/50 border border-bronze/10 space-y-4">
          <span className="text-xs font-bold text-bronze uppercase block">
            Invite Codes & Sharing
          </span>
          <p className="text-xs text-stone-500 leading-relaxed">
            Доорх кодыг ашиглан гэр бүлийнхэн чинь шууд засах эсвэл харах эрхээр
            нэгдэх боломжтой.
          </p>

          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 block font-bold">
                Идэвхтэй урилгын код
              </span>
              {treeLoading ? (
                <div className="h-7 w-32 bg-stone-100 rounded animate-pulse mt-0.5" />
              ) : (
                <span className="text-lg font-mono font-bold tracking-wider text-ink">
                  {tree?.code || "CEDIG-00000"}
                </span>
              )}
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition cursor-pointer"
              title="Код хуулах"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <p className="text-[10px] text-emerald-600 font-medium">Код хуулагдлаа!</p>
          )}
        </div>

        {/* Invite by Username Section — only Owner/Admin can invite */}
        {isAdmin && (
        <form
          onSubmit={handleInvite}
          className="p-5 rounded-2xl bg-pine/5 border border-ink/5 space-y-4 text-xs font-medium"
        >
          <span className="text-xs font-bold text-ink uppercase block">
            Invite members
          </span>

          <div className="space-y-1">
            <label className="text-stone-500 block">@ Хэрэглэгчийн нэр</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="@username"
                value={selectedUser ? `@${selectedUser.username}` : undefined}
                onChange={handleUsernameInput}
                className="w-full bg-white border border-ink/15 rounded-xl py-2 px-3 pl-9 focus:outline-none"
                disabled={!!selectedUser}
              />
              {searching ? (
                <Loader2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {results.length > 0 && !selectedUser && (
              <div className="mt-1 border border-stone-200 rounded-xl bg-white shadow-sm max-h-40 overflow-y-auto divide-y divide-stone-100">
                {results.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 transition text-left cursor-pointer"
                  >
                    <Avatar src={u.avatar} name={u.displayName} size={28} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">{u.displayName}</p>
                      <p className="text-[10px] text-stone-400">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searching && (
              <div className="mt-1 p-2 text-[10px] text-stone-400">Хайж байна...</div>
            )}

            {!searching && query.length >= 2 && results.length === 0 && !selectedUser && (
              <div className="mt-1 p-2 text-[10px] text-amber-600">Хэрэглэгч олдсонгүй</div>
            )}

            {/* Selected User Preview */}
            {selectedUser && (
              <div className="mt-2 p-3 border border-pine/20 rounded-xl bg-pine/5 flex items-center gap-3">
                <Avatar src={null} name={selectedUser.displayName} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800 truncate">{selectedUser.displayName}</p>
                  <p className="text-[10px] text-stone-400">@{selectedUser.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); clearSearch(); }}
                  className="p-1 rounded text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-stone-500 block">Role</label>
            <select
              value={inviteRole}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInviteRole(e.target.value as "Editor" | "Viewer")}
              className="w-full bg-white border border-ink/15 rounded-xl py-2 px-3 focus:outline-none"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedUser || inviting}
            className="w-full bg-pine text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-pine/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {inviting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Урьж байна...
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" /> Урилга Илгээх
              </>
            )}
          </button>
        </form>
        )}
        {!isAdmin && (
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 flex flex-col items-center justify-center text-center">
            <Users className="w-6 h-6 text-stone-300" />
            <div>
              <p className="text-xs font-bold text-stone-500">Эрх байхгүй байна.</p>
              <p className="text-[10px] text-stone-400 mt-1">
                Та энэ ургийн модонд гишүүн урих эрхгүй байна.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="border-t border-stone-100 pt-6 space-y-4 text-xs font-semibold">
        <span className="text-xs font-bold text-bronze uppercase tracking-wider block">
          Уригдсан гишүүдийн бүртгэл
        </span>

        <div className="space-y-3">
          {/* Owner */}
          {membersLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            <>
              {owner && (
                <div className="p-4 border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={owner.avatar}
                      name={owner.displayName || owner.email}
                      size={36}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-stone-800 text-xs truncate">
                        {owner.displayName || owner.username || "Owner"}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono truncate">
                        @{owner.username || "owner"}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-bronze text-ink rounded font-bold text-[9px] uppercase tracking-wider shrink-0">
                    ЭЗЭМШИГЧ (OWNER)
                  </span>
                </div>
              )}

              {/* Other Members */}
              {otherMembers.length === 0 && !membersLoading && (
                <div className="p-6 text-center text-stone-400 text-xs">
                  <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  Одоогоор гишүүн байхгүй байна.
                </div>
              )}

              {otherMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 border border-stone-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <Avatar
                      src={member.avatar}
                      name={member.displayName || member.email}
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-stone-800 text-xs truncate">
                        {member.displayName || member.email}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        @{member.username || member.email?.split("@")[0] || "user"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Role display — clickable for admins, static for non-admins */}
                    {isAdmin ? (
                      changingRoleId === member.id ? (
                        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1">
                          {ROLE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleChangeRole(member, opt.value)}
                              disabled={updatingRole === member.userId}
                              className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition cursor-pointer flex items-center gap-1 ${
                                member.role === opt.value
                                  ? "bg-pine text-white"
                                  : "text-stone-500 hover:text-ink"
                              }`}
                            >
                              <opt.icon className="w-3 h-3" />
                              {opt.label}
                            </button>
                          ))}
                          <button
                            onClick={() => setChangingRoleId(null)}
                            className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setChangingRoleId(member.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap border transition cursor-pointer hover:opacity-80 ${
                            member.role === "Admin"
                              ? "bg-bronze/10 text-ink border-bronze/20"
                              : member.role === "Editor"
                                ? "bg-pine/10 text-ink border-pine/20"
                                : "bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                          title="Эрх өөрчлөх"
                        >
                          {updatingRole === member.userId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : member.role === "Admin" ? (
                            <Shield className="w-3 h-3" />
                          ) : member.role === "Editor" ? (
                            <Pencil className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          {member.role}
                        </button>
                      )
                    ) : (
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap border ${
                          member.role === "Admin"
                            ? "bg-bronze/10 text-ink border-bronze/20"
                            : member.role === "Editor"
                              ? "bg-pine/10 text-ink border-pine/20"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                        }`}
                      >
                        {member.role === "Admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : member.role === "Editor" ? (
                          <Pencil className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        {member.role}
                      </span>
                    )}

                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap bg-emerald-100 text-emerald-800">
                      {member.status || "Active"}
                    </span>

                    {/* Remove with confirmation */}
                    {isAdmin ? (
                      confirmDelete === member.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                            title="Батлах"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                            title="Цуцлах"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(member.id)}
                          className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Эрх цуцлах"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      )
                    ) : null}
        </div>

        {/* Join Requests (Owner/Admin only) */}
        {isAdmin && pendingCount > 0 && (
          <div className="border-t border-stone-100 pt-6 space-y-4 text-xs font-semibold">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Нэгдэх хүсэлтүүд ({pendingCount})
            </span>

            <div className="space-y-3">
              {joinRequests.filter(r => r.status === 'Pending').map((req) => (
                <div
                  key={req.id}
                  className="p-4 border border-amber-200 bg-amber-50/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <Avatar
                      src={req.avatar}
                      name={req.displayName || req.username}
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-stone-800 text-xs truncate">
                        {req.displayName || req.username}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        @{req.username} · {req.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveRequest(req.id)}
                      disabled={acting === req.id}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                    >
                      {acting === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Зөвшөөрөх'}
                    </button>
                    <button
                      onClick={() => rejectRequest(req.id)}
                      disabled={acting === req.id}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
                    >
                      Татгалзах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
