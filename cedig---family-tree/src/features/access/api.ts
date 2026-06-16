import { api } from '@/src/lib/api';
import type { FamilyTree, TreeMember, UserSearchResult, InviteMemberRequest, UpdateRoleRequest } from './types';

export async function fetchFamilyTree(treeId: string): Promise<FamilyTree> {
  return api.get<FamilyTree>(`/trees/${treeId}`);
}

export async function fetchMembers(treeId: string): Promise<TreeMember[]> {
  const data = await api.get<TreeMember[]>(`/trees/${treeId}/members`);
  return data || [];
}

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query || query.length < 2) return [];
  const data = await api.get<UserSearchResult[]>(`/users/search?query=${encodeURIComponent(query)}`);
  return data || [];
}

export async function inviteMember(treeId: string, request: InviteMemberRequest): Promise<{ id: string; userId: string; role: string }> {
  return api.post<{ id: string; userId: string; role: string }>(`/invites/tree/${treeId}`, request);
}

export async function fetchPendingInvites(): Promise<import('./types').PendingInvite[]> {
  const data = await api.get<import('./types').PendingInvite[]>('/invites/user');
  return data || [];
}

export async function acceptInvite(inviteId: string): Promise<{ treeId: string; role: string }> {
  return api.post<{ treeId: string; role: string }>(`/invites/${inviteId}/accept`);
}

export async function declineInvite(inviteId: string): Promise<{ status: string }> {
  return api.post<{ status: string }>(`/invites/${inviteId}/decline`);
}

export async function fetchJoinRequests(treeId: string): Promise<import('./types').JoinRequest[]> {
  const data = await api.get<import('./types').JoinRequest[]>(`/trees/${treeId}/join-requests`);
  return data || [];
}

export async function approveJoinRequest(treeId: string, requestId: string): Promise<void> {
  await api.post(`/trees/${treeId}/join-requests/${requestId}/approve`);
}

export async function rejectJoinRequest(treeId: string, requestId: string): Promise<void> {
  await api.post(`/trees/${treeId}/join-requests/${requestId}/reject`);
}

export async function fetchPendingJoinRequestsForOwner(): Promise<import('./types').JoinRequest[]> {
  const data = await api.get<import('./types').JoinRequest[]>('/trees/join-requests/pending');
  return data || [];
}

export async function updateMemberRole(treeId: string, request: UpdateRoleRequest): Promise<void> {
  await api.put(`/trees/${treeId}/members/role`, request);
}

export async function removeMember(treeId: string, userId: string): Promise<void> {
  await api.delete(`/trees/${treeId}/members/${userId}`);
}
