import { useAppStore } from "../../lib/store";
import type { NotificationType } from "@/src/types/notification";

export function notificationService() {
  const store = useAppStore.getState();

  return {
    addNotification: (type: NotificationType, title: string, message: string) =>
      store.addNotification(type, title, message),

    markAsRead: (id: string) =>
      store.markNotificationAsRead(id),

    markAllAsRead: () =>
      store.markAllNotificationsAsRead(),

    clearAll: () =>
      store.clearNotifications(),
  };
}
