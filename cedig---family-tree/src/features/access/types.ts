export interface FamilyTree {
  id: string;
  name: string;
  code: string;
  clanName?: string;
  description?: string;
  privacySetting?: string;
  ownerId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreeMember {
  id: string;
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string | null;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: string;
  joinedAt: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface InviteMemberRequest {
  userId: string;
  role: 'Editor' | 'Viewer';
}

export interface UpdateRoleRequest {
  targetUserId: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

export interface PendingInvite {
  id: string;
  treeId: string;
  treeName: string;
  treeCode: string;
  role: string;
  status: string;
  code: string;
  invitedBy: {
    id: string;
    displayName: string;
    username: string;
    avatar: string | null;
  } | null;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  treeId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  code: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  message: string | null;
  createdAt: string;
}
