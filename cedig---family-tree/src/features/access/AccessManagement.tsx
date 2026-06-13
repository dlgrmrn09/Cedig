"use client";

import React, { useState } from "react";
import { useAppStore } from "@/src/store";
import {
  Users,
  Mail,
  Phone,
  UserMinus,
  Eye,
  Pencil,
  Check,
  X,
} from "lucide-react";

export function AccessManagement() {
  const { invites, createInvite, removeInvite, updateInviteRole, user, addNotification } =
    useAppStore();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"Editor" | "Viewer">("Editor");
  const [, setSuccess] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [treeInviteCode] = useState("SARTUUL-785");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      addNotification("warn", "Буруу хаяг", "Зөв и-мэйл хаяг оруулна уу.");
      return;
    }

    createInvite({
      email,
      phone,
      role,
    });

    setEmail("");
    setPhone("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
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
              <span className="text-lg font-mono font-bold tracking-wider text-ink">
                {treeInviteCode}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleInvite}
          className="p-5 rounded-2xl bg-pine/5 border border-ink/5 space-y-4 text-xs font-medium"
        >
          <span className="text-xs font-bold text-ink uppercase block">
            Invite members
          </span>

          <div className="space-y-1">
            <label className="text-stone-500 block"> И-мэйл</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-ink/15 rounded-xl py-2 px-3 pl-9 focus:outline-none"
              />
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-stone-500 block">
                Утасны дугаар (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-ink/15 rounded-xl py-2 px-3 pl-9 focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-500 block">Role</label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full bg-white border border-ink/15 rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pine text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px]"
          >
            Урилга Илгээх
          </button>
        </form>
      </div>

      <div className="border-t border-stone-100 pt-6 space-y-4 text-xs font-semibold">
        <span className="text-xs font-bold text-bronze uppercase tracking-wider block">
          Уригдсан гишүүдийн бүртгэл
        </span>

        <div className="space-y-3">
          <div className="p-4 border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-pine text-vellum flex items-center justify-center font-bold shrink-0">
                B
              </div>
              <div className="min-w-0">
                <p className="font-bold text-stone-800 text-xs truncate">
                  {user?.name || "Bat-Erdene"}
                </p>
                <p className="text-[10px] text-stone-400 font-mono truncate">
                  {user?.email || "owner@cedig.mn"}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-bronze text-ink rounded font-bold text-[9px] uppercase tracking-wider shrink-0">
              ЭЗЭМШИГЧ (OWNER)
            </span>
          </div>

          {invites.map((inv, idx) => (
            <div
              key={idx}
              className="p-4 border border-stone-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold shrink-0">
                  {inv.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-stone-800 text-xs truncate">
                    {inv.email}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">
                    {inv.phone || "Утас тодорхойгүй"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Editable Role */}
                {editingRole === inv.email ? (
                  <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5">
                    <button
                      onClick={() => { updateInviteRole(inv.email, "Editor"); setEditingRole(null); addNotification("success", "Эрх шинэчлэгдлээ", `${inv.email} → Editor`); }}
                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition cursor-pointer ${inv.role === "Editor" ? "bg-pine text-white" : "text-stone-500 hover:text-ink"}`}
                    >
                      <Pencil className="w-3 h-3 inline mr-1" />Editor
                    </button>
                    <button
                      onClick={() => { updateInviteRole(inv.email, "Viewer"); setEditingRole(null); addNotification("success", "Эрх шинэчлэгдлээ", `${inv.email} → Viewer`); }}
                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition cursor-pointer ${inv.role === "Viewer" ? "bg-stone-600 text-white" : "text-stone-500 hover:text-ink"}`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />Viewer
                    </button>
                    <button
                      onClick={() => setEditingRole(null)}
                      className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingRole(inv.email)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap border transition cursor-pointer hover:opacity-80 ${
                      inv.role === "Editor"
                        ? "bg-pine/10 text-ink border-pine/20"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                    title="Эрх өөрчлөх"
                  >
                    {inv.role === "Editor" ? <Pencil className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {inv.role}
                  </button>
                )}

                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap ${
                    inv.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800 animate-pulse"
                  }`}
                >
                  {inv.status}
                </span>

                {/* Delete with confirmation */}
                {confirmDelete === inv.email ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { removeInvite(inv.email); setConfirmDelete(null); addNotification("success", "Устгагдлаа", `${inv.email} гишүүний эрх цуцлагдлаа.`); }}
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
                    onClick={() => setConfirmDelete(inv.email)}
                    className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded transition cursor-pointer"
                    title="Эрх цуцлах"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
