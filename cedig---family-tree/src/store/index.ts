import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";
import { createPersonSlice, type PersonSlice } from "./slices/personSlice";
import { createMediaSlice, type MediaSlice } from "./slices/mediaSlice";
import { createNotificationSlice, type NotificationSlice } from "./slices/notificationSlice";
import { createActivitySlice, type ActivitySlice } from "./slices/activitySlice";
import { createInviteSlice, type InviteSlice } from "./slices/inviteSlice";
import { createFilterSlice, type FilterSlice } from "./slices/filterSlice";
import type { Person } from "@/src/types/person";
import type { MediaItem } from "@/src/types/media";
import type { AppNotification } from "@/src/types/notification";
import type { ActivityLog } from "@/src/types/activity";

export type AppState = AuthSlice & PersonSlice & MediaSlice & NotificationSlice & ActivitySlice & InviteSlice & FilterSlice;

export const useAppStore = create<AppState>()((...a) => {
  const [set, get] = a;
  const auth = createAuthSlice(...a);
  const person = createPersonSlice(...a);
  const media = createMediaSlice(...a);
  const notifications = createNotificationSlice(...a);
  const activity = createActivitySlice(...a);
  const invites = createInviteSlice(...a);
  const filters = createFilterSlice(...a);

  return {
    ...auth,
    ...person,
    ...media,
    ...notifications,
    ...activity,
    ...invites,
    ...filters,

    // Override addPerson to include activity + notification side effects
    addPerson: (personData: Omit<Person, "id" | "verified" | "pendingOralHistory">) => {
      person.addPerson(personData);
      const state = get();
      const newPerson = state.people[0]; // most recently added
      if (!newPerson) return;
      const desc = `Added Ancestor line: ${newPerson.firstName} ${newPerson.lastName} (${newPerson.birthYear})`;
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: "add",
        description: desc,
        personId: newPerson.id,
        userName: state.user?.name || "Guest User",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        type: "success",
        title: "New Member Added",
        message: `${newPerson.firstName} was successfully added as a ${newPerson.relationshipLabel.toLowerCase()} relation.`,
        isRead: false,
        time: "Just now",
      };
      set({
        activities: [newActivity, ...state.activities],
        notifications: [newNotification, ...state.notifications],
      });
    },

    // Override editPerson to include activity + notification side effects
    editPerson: (id: string, updates: Partial<Person>) => {
      const state = get();
      const original = state.people.find((p) => p.id === id);
      if (!original) return;
      person.editPerson(id, updates);
      const desc = `Edited detailed values for: ${original.firstName} ${original.lastName}`;
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: "edit",
        description: desc,
        personId: id,
        userName: state.user?.name || "Guest User",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        type: "info",
        title: "Person Profile Updated",
        message: `${original.firstName}'s family profile card was modified.`,
        isRead: false,
        time: "Just now",
      };
      set({
        activities: [newActivity, ...state.activities],
        notifications: [newNotification, ...state.notifications],
      });
    },

    // Override deletePerson to include activity side effect
    deletePerson: (id: string) => {
      const state = get();
      const original = state.people.find((p) => p.id === id);
      if (!original) return;
      person.deletePerson(id);
      const desc = `Removed ancestor record: ${original.firstName} ${original.lastName}`;
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: "delete",
        description: desc,
        userName: state.user?.name || "Guest User",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      set({ activities: [newActivity, ...state.activities] });
    },

    // Override addMediaItem to include activity + notification side effects
    addMediaItem: (mediaData: Omit<MediaItem, "id" | "uploadedAt" | "version">) => {
      media.addMediaItem(mediaData);
      const state = get();
      const newMedia = state.media[0];
      if (!newMedia) return;
      const targetPerson = state.people.find((p) => p.id === mediaData.personId);
      const activityDesc = `Uploaded digital document: "${mediaData.title}" for ${targetPerson ? targetPerson.firstName : "ancestor"}`;
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: "media_add",
        description: activityDesc,
        personId: mediaData.personId,
        userName: state.user?.name || "Guest User",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        type: "success",
        title: "Historical Document Uploaded",
        message: `"${mediaData.title}" successfully added to the digital preservation archive.`,
        isRead: false,
        time: "Just now",
      };
      set({
        activities: [newActivity, ...state.activities],
        notifications: [newNotification, ...state.notifications],
      });
    },

    // Override deleteMediaItem to include activity side effect
    deleteMediaItem: (id: string) => {
      const state = get();
      const original = state.media.find((m) => m.id === id);
      if (!original) return;
      media.deleteMediaItem(id);
      const desc = `Deleted archived document: "${original.title}"`;
      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: "media_delete",
        description: desc,
        personId: original.personId,
        userName: state.user?.name || "Guest User",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      set({ activities: [newActivity, ...state.activities] });
    },
  };
});
