export interface AccountProfile {
  firstName: string;
  lastName: string;
  username: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
