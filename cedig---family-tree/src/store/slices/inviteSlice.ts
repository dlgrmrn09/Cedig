import type { StateCreator } from "zustand";
import type { MemberInvite } from "@/src/types/auth";
import { createInvite, updateInviteRole, removeInvite } from "@/src/services/inviteService";

const initialInvites: MemberInvite[] = [];

export interface InviteSlice {
  invites: MemberInvite[];
  createInvite: (data: Omit<MemberInvite, "status" | "code" | "id">) => void;
  removeInvite: (id: string) => void;
  updateInviteRole: (id: string, role: "Editor" | "Viewer") => void;

  createInviteAsync: (treeId: string, data: { userId: string; role: "Editor" | "Viewer" }) => Promise<void>;
  removeInviteAsync: (treeId: string, id: string) => Promise<void>;
  updateInviteRoleAsync: (treeId: string, id: string, role: "Editor" | "Viewer") => Promise<void>;
}

export const createInviteSlice: StateCreator<InviteSlice, [], [], InviteSlice> = (set) => ({
  invites: initialInvites,

  createInvite: (inviteData) =>
    set((state) => {
      const code = `${inviteData.role.toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
      return {
        invites: [...state.invites, { ...inviteData, id: `inv-${Date.now()}`, code, status: "Pending" as const }],
      };
    }),

  removeInvite: (id) =>
    set((state) => ({
      invites: state.invites.filter((inv) => inv.id !== id),
    })),

  updateInviteRole: (id, role) =>
    set((state) => ({
      invites: state.invites.map((inv) =>
        inv.id === id ? { ...inv, role } : inv
      ),
    })),

  createInviteAsync: async (treeId: string, inviteData) => {
    try {
      const newInvite = await createInvite(treeId, {
        userId: inviteData.userId,
        role: inviteData.role,
      });
      set((s) => ({ invites: [...s.invites, newInvite] }));
    } catch (error) {
      console.error('Failed to create invite:', error);
      throw error;
    }
  },

  removeInviteAsync: async (treeId: string, id: string) => {
    try {
      await removeInvite(treeId, id);
      set((state) => ({
        invites: state.invites.filter((inv) => inv.id !== id),
      }));
    } catch (error) {
      console.error('Failed to remove invite:', error);
      throw error;
    }
  },

  updateInviteRoleAsync: async (treeId: string, id: string, role: "Editor" | "Viewer") => {
    try {
      const updated = await updateInviteRole(treeId, id, role);
      set((state) => ({
        invites: state.invites.map((inv) =>
          inv.id === updated.id ? { ...inv, role: updated.role } : inv
        ),
      }));
    } catch (error) {
      console.error('Failed to update invite role:', error);
      throw error;
    }
  },
});
