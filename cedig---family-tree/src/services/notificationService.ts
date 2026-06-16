import { api } from '@/src/lib/api';
import type { AppNotification } from '@/src/types/notification';

export interface BackendNotification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warn';
  title: string;
  message: string;
  is_read: boolean;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

function mapNotification(b: BackendNotification): AppNotification {
  const created = new Date(b.created_at);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let time: string;
  if (diffHours < 1) time = 'Just now';
  else if (diffHours < 24) time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  else time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return {
    id: b.id,
    type: b.type,
    title: b.title,
    message: b.message,
    isRead: b.is_read,
    time,
  };
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const response = await api.getPaginated<BackendNotification>('/notifications');
  return (response.data || []).map(mapNotification);
}

export async function fetchUnreadCount(): Promise<number> {
  const data = await api.get<{ count: number }>('/notifications/unread-count');
  return data.count;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await api.put(`/notifications/${notificationId}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.put('/notifications/read-all');
}

export async function clearNotifications(): Promise<void> {
  await api.delete('/notifications/clear');
}
