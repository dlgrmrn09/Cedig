import type { StateCreator } from "zustand";
import type { AppNotification, NotificationType } from "@/src/types/notification";

const initialNotifications: AppNotification[] = [
  { id: "n1", type: "success", title: "Tree Setup Completed", message: "CEDIG has successfully initialized the Sartuul Family Tree.", isRead: false, time: "2 hours ago" },
  { id: "n2", type: "info", title: "Curation Tip", message: "Add birth certificates for descendants to automatically earn the \"Verified\" badge.", isRead: false, time: "4 hours ago" },
];

export interface NotificationSlice {
  notifications: AppNotification[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice, [], [], NotificationSlice> = (set) => ({
  notifications: initialNotifications,

  addNotification: (type, title, message) =>
    set((state) => ({
      notifications: [
        { id: `notif-${Date.now()}`, type, title, message, isRead: false, time: "Just now" },
        ...state.notifications,
      ],
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),
});
