import { useState, useCallback } from "react";
import { useAppStore } from "../../lib/store";

export function useNotifications() {
  const notifications = useAppStore((s) => s.notifications);
  const addNotification = useAppStore((s) => s.addNotification);
  const markNotificationAsRead = useAppStore((s) => s.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore((s) => s.markAllNotificationsAsRead);
  const clearNotifications = useAppStore((s) => s.clearNotifications);

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const filteredNotifications = notifications.filter((n) => {
    const matchFilter = filter === "all" || (filter === "unread" && !n.isRead);
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const markRead = useCallback(
    (id: string) => markNotificationAsRead(id),
    [markNotificationAsRead],
  );

  const markAllRead = useCallback(
    () => markAllNotificationsAsRead(),
    [markAllNotificationsAsRead],
  );

  const clearAll = useCallback(
    () => clearNotifications(),
    [clearNotifications],
  );

  return {
    notifications,
    filteredNotifications,
    filter,
    setFilter,
    search,
    setSearch,
    markRead,
    markAllRead,
    clearAll,
    addNotification,
  };
}
