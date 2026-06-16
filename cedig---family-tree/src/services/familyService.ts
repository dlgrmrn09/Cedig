import { api } from '@/src/lib/api';

export interface BackendTree {
  id: string;
  name: string;
  code: string;
  clanName?: string;
  ownerId?: string;
  description?: string;
  privacySetting?: string;
  isActive?: boolean;
  members?: Array<{
    id: string;
    userId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatar: string | null;
    role: string;
    status: string;
    joinedAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  first_name: string;
  last_name: string;
  surname: string | null;
  clan_name: string;
  birth_place: string;
  biography: string | null;
  zodiac_sign: string | null;
  birth_year: number;
  birth_date: string | null;
  death_date: string | null;
  gender: 'male' | 'female';
  occupation: string | null;
  education: string | null;
  awards: string[];
  notes: string | null;
  relationship_label: string;
  verified: boolean;
  pending_oral_history: boolean;
  father_id: string | null;
  mother_id: string | null;
  spouse_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchMyTrees(): Promise<BackendTree[]> {
  const data = await api.get<BackendTree[]>('/trees');
  return data || [];
}

export async function fetchTreeById(treeId: string): Promise<BackendTree | null> {
  try {
    const data = await api.get<BackendTree>(`/trees/${treeId}`);
    return data;
  } catch {
    return null;
  }
}

export async function fetchTreeByCode(code: string): Promise<BackendTree | null> {
  try {
    const trees = await fetchMyTrees();
    return trees.find((t) => t.code === code) || null;
  } catch {
    return null;
  }
}

export async function fetchTreeMembers(treeId: string): Promise<BackendTree['members']> {
  const data = await api.get<BackendTree['members']>(`/trees/${treeId}/members`);
  return data || [];
}

export async function createTree(name: string, clanName?: string): Promise<BackendTree> {
  const data = await api.post<BackendTree>('/trees', { name, clanName });
  return data;
}

export interface JoinRequestResult {
  treeId: string;
  treeName: string;
  status: 'Pending';
  message?: string;
}

export async function joinTree(code: string): Promise<JoinRequestResult> {
  const data = await api.post<JoinRequestResult>('/trees/join', { code });
  return data;
}

export async function updateTree(treeId: string, updates: { name?: string; clanName?: string; description?: string; privacySetting?: string }) {
  return api.put<BackendTree>(`/trees/${treeId}`, updates);
}

export async function deleteTree(treeId: string): Promise<void> {
  await api.delete(`/trees/${treeId}`);
}
