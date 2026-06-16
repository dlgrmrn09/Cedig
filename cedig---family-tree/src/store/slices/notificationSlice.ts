import type { StateCreator } from "zustand";
import type { AppNotification, NotificationType } from "@/src/types/notification";
import { markAsRead, markAllAsRead, clearNotifications } from "@/src/services/notificationService";

const initialNotifications: AppNotification[] = [];

export interface NotificationSlice {
  notifications: AppNotification[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  markNotificationAsReadAsync: (id: string) => Promise<void>;
  markAllNotificationsAsReadAsync: () => Promise<void>;
  clearNotificationsAsync: () => Promise<void>;
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

  markNotificationAsReadAsync: async (id) => {
    try {
      await markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllNotificationsAsReadAsync: async () => {
    try {
      await markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  clearNotificationsAsync: async () => {
    try {
      await clearNotifications();
      set({ notifications: [] });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },
});
