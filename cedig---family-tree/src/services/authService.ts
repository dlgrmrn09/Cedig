import { api } from '@/src/lib/api';

export interface BackendUserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  countryCode: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  authMethod: string;
}

export interface FrontendUser {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatar?: string;
  code: string;
  familyTreeCode?: string;
  familyTreeName?: string;
  treeId?: string;
}

export interface TreeItem {
  id: string;
  name: string;
  code: string;
  role: string;
  clanName?: string;
  ownerId?: string;
  createdAt?: string;
}

export interface GetMeResponse {
  user: FrontendUser;
  trees: TreeItem[];
  ownedTrees: TreeItem[];
  sharedTrees: TreeItem[];
}

export async function getMe(): Promise<GetMeResponse | null> {
  try {
    const profile = await api.get<BackendUserProfile & { ownedTrees?: TreeItem[]; sharedTrees?: TreeItem[] }>('/auth/me');

    let ownedTrees: TreeItem[] = profile.ownedTrees || [];
    let sharedTrees: TreeItem[] = profile.sharedTrees || [];
    let trees: TreeItem[] = [...ownedTrees, ...sharedTrees];

    if (trees.length === 0) {
      try {
        const treesData = await api.get<TreeItem[]>('/trees');
        if (treesData.length > 0) {
          ownedTrees = treesData.filter((t: TreeItem) => t.role === 'Owner');
          sharedTrees = treesData.filter((t: TreeItem) => t.role !== 'Owner');
          trees = treesData;
        }
      } catch {
        // User may have no trees yet (fresh registration)
      }
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        username: profile.username,
        role: (profile.role as FrontendUser['role']) || 'Viewer',
        avatar: profile.avatar || undefined,
        code: '',
      },
      trees,
      ownedTrees,
      sharedTrees,
    };
  } catch {
    return null;
  }
}

export interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export interface RegisterResult {
  accessToken: string;
  refreshToken: string;
  user: FrontendUser;
  familyTree: { code: string; name: string; id: string };
}

export async function registerWithBackend(payload: RegisterPayload, recaptchaToken?: string): Promise<RegisterResult> {
  const data = await api.post<RegisterResult>('/auth/register/email', { ...payload, recaptchaToken });
  return data;
}

export interface PhoneRegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  password: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export async function registerWithPhone(payload: PhoneRegisterPayload, recaptchaToken?: string): Promise<RegisterResult> {
  const data = await api.post<RegisterResult>('/auth/register/phone', { ...payload, recaptchaToken });
  return data;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: BackendUserProfile;
}

export async function loginWithBackend(email: string, password: string, recaptchaToken?: string): Promise<LoginResult> {
  const data = await api.post<LoginResult>('/auth/login/email', { email, password, recaptchaToken });
  return data;
}

export async function socialLoginWithBackend(idToken: string, provider: 'google' | 'facebook'): Promise<LoginResult> {
  const data = await api.post<LoginResult>('/auth/social', { idToken, provider });
  return data;
}

export async function backendLogout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore
  }
}

export async function updateProfile(data: { firstName?: string; lastName?: string; username?: string }) {
  return api.put<{ id: string; name: string; firstName: string; lastName: string; username: string }>('/settings/profile', data);
}

export async function updateEmail(email: string) {
  return api.put<{ email: string }>('/settings/email', { email });
}

export async function updatePhone(phone: string, countryCode: string) {
  return api.put<{ phone: string; countryCode: string }>('/settings/phone', { phone, countryCode });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return api.put<{ message: string }>('/settings/password', { currentPassword, newPassword });
}

export async function deleteAccount() {
  return api.delete<{ message: string }>('/settings/account');
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<{ avatarUrl: string }>('/uploads/avatar', formData);
}

export async function deleteAvatar(): Promise<void> {
  await api.delete('/uploads/avatar');
}
