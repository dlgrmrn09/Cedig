export interface ActivityLog {
  id: string;
  type: 'add' | 'edit' | 'delete' | 'media_add' | 'media_delete' | 'role_update';
  description: string;
  personId?: string;
  userName: string;
  timestamp: string;
}

export type ActivityType = 'add' | 'edit' | 'delete' | 'media_add' | 'media_delete' | 'role_update';
