import type { StateCreator } from "zustand";
import type { MemberInvite } from "@/src/types/auth";

const initialInvites: MemberInvite[] = [
  { email: "khangai@cedig.mn", phone: "+97699112233", role: "Editor", code: "SARTUUL-785", status: "Pending" },
  { email: "altan@example.mn", role: "Viewer", code: "VIEW-998", status: "Active" },
];

export interface InviteSlice {
  invites: MemberInvite[];
  createInvite: (data: Omit<MemberInvite, "status" | "code">) => void;
  removeInvite: (email: string) => void;
  updateInviteRole: (email: string, role: "Editor" | "Viewer") => void;
}

export const createInviteSlice: StateCreator<InviteSlice, [], [], InviteSlice> = (set) => ({
  invites: initialInvites,

  createInvite: (inviteData) =>
    set((state) => {
      const code = `${inviteData.role.toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
      return {
        invites: [...state.invites, { ...inviteData, code, status: "Pending" as const }],
      };
    }),

  removeInvite: (email) =>
    set((state) => ({
      invites: state.invites.filter((inv) => inv.email !== email),
    })),

  updateInviteRole: (email, role) =>
    set((state) => ({
      invites: state.invites.map((inv) =>
        inv.email === email ? { ...inv, role } : inv
      ),
    })),
});
