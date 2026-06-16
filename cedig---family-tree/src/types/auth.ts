export type UserRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  code: string;
}

export interface MemberInvite {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  role: 'Editor' | 'Viewer';
  code: string;
  status: 'Pending' | 'Active';
}

export type InviteRole = 'Editor' | 'Viewer';
export type InviteStatus = 'Pending' | 'Active';
