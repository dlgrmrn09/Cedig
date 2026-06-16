import { api } from '@/src/lib/api';

export interface BackendInvite {
  id: string;
  userId: string;
  role: 'Editor' | 'Viewer';
  code: string;
  status: 'Pending' | 'Active';
  username?: string;
  displayName?: string;
  avatar?: string;
}

function mapInvite(b: BackendInvite) {
  return {
    id: b.id,
    userId: b.userId,
    username: b.username || '',
    displayName: b.displayName || b.userId,
    role: b.role,
    code: b.code,
    status: b.status,
  };
}

export async function fetchInvites(treeId: string): Promise<ReturnType<typeof mapInvite>[]> {
  const response = await api.getPaginated<BackendInvite>(`/invites/tree/${treeId}`);
  return (response.data || []).map(mapInvite);
}

export async function createInvite(
  treeId: string,
  invite: { userId: string; role: 'Editor' | 'Viewer' },
): Promise<ReturnType<typeof mapInvite>> {
  const data = await api.post<BackendInvite>(`/invites/tree/${treeId}`, {
    userId: invite.userId,
    role: invite.role,
  });
  return mapInvite(data);
}

export async function updateInviteRole(
  treeId: string,
  inviteId: string,
  role: 'Editor' | 'Viewer',
): Promise<{ id: string; userId: string; role: 'Editor' | 'Viewer' }> {
  const data = await api.put<{ id: string; userId: string; role: string }>(
    `/invites/tree/${treeId}/${inviteId}`,
    { role }
  );
  return { id: data.id, userId: data.userId, role: role };
}

export async function removeInvite(treeId: string, inviteId: string): Promise<void> {
  await api.delete(`/invites/tree/${treeId}/${inviteId}`);
}
