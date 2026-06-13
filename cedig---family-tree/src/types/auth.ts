export type UserRole = 'Owner' | 'Editor' | 'Viewer';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  code: string;
}

export interface MemberInvite {
  email: string;
  phone?: string;
  role: 'Editor' | 'Viewer';
  code: string;
  status: 'Pending' | 'Active';
}

export type InviteRole = 'Editor' | 'Viewer';
export type InviteStatus = 'Pending' | 'Active';
