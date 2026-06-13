export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warn';
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

export type NotificationType = 'info' | 'success' | 'warn';
