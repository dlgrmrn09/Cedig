export const USER_ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

export const INVITE_ROLES = ['Editor', 'Viewer'];

export const INVITE_STATUS = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARN: 'warn',
};

export const ACTIVITY_TYPES = {
  PERSON_CREATED: 'person_created',
  PERSON_UPDATED: 'person_updated',
  PERSON_DELETED: 'person_deleted',
  TREE_CREATED: 'tree_created',
  TREE_UPDATED: 'tree_updated',
  TREE_DELETED: 'tree_deleted',
  MEMBER_JOINED: 'member_joined',
  MEMBER_APPROVED: 'member_approved',
  MEMBER_REJECTED: 'member_rejected',
  MEMBER_REMOVED: 'member_removed',
  PHOTO_UPLOADED: 'photo_uploaded',
  PHOTO_DELETED: 'photo_deleted',
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_DELETED: 'document_deleted',
  RELATIONSHIP_CREATED: 'relationship_created',
  RELATIONSHIP_UPDATED: 'relationship_updated',
  RELATIONSHIP_DELETED: 'relationship_deleted',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  MEDIA_ADD: 'media_add',
  MEDIA_DELETE: 'media_delete',
  ROLE_UPDATE: 'role_update',
};

export const MEDIA_TYPES = {
  PHOTO: 'photo',
  DOCUMENT: 'document',
  CERTIFICATE: 'certificate',
};

export const RELATIONSHIP_LABELS = {
  DIRECT_LINE: 'DIRECT LINE',
  HEAD_OF_CLAN: 'HEAD OF CLAN',
  MATRIARCH: 'MATRIARCH',
  DESCENDANT: 'DESCENDANT',
  SPOUSE: 'SPOUSE',
  RELATIVE: 'RELATIVE',
};

export const CLANS = ['Sartuul', 'Borgijin'];

export const GENDERS = ['male', 'female'];

export const YEAR_RANGE = {
  MIN: 1900,
  MAX: 2026,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'],
};

export const SOCKET_EVENTS = {
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_READ: 'notification.read',
  MEMBER_CREATED: 'member.created',
  MEMBER_UPDATED: 'member.updated',
  MEMBER_DELETED: 'member.deleted',
  USER_ONLINE: 'user.online',
  USER_OFFLINE: 'user.offline',
  ACTIVITY_CREATED: 'activity.created',
  MEDIA_CREATED: 'media.created',
  MEDIA_DELETED: 'media.deleted',
};
