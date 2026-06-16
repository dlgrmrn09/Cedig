export interface ActivityLog {
  id: string;
  type: ActivityType;
  description: string;
  personId?: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  user?: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
    username: string;
  } | null;
}

export type ActivityType =
  | 'add' | 'edit' | 'delete' | 'media_add' | 'media_delete' | 'role_update'
  | 'person_created' | 'person_updated' | 'person_deleted'
  | 'tree_created' | 'tree_updated' | 'tree_deleted'
  | 'member_joined' | 'member_approved' | 'member_rejected' | 'member_removed'
  | 'photo_uploaded' | 'photo_deleted'
  | 'document_uploaded' | 'document_deleted'
  | 'relationship_created' | 'relationship_updated' | 'relationship_deleted';
