import type { StateCreator } from "zustand";
import type { ViewType, WorkspaceTab } from "@/src/types/common";

function setAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "cedig-auth=1; path=/; max-age=86400; SameSite=Lax";
  }
}

function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "cedig-auth=; path=/; max-age=0; SameSite=Lax";
  }
}

export interface User {
  name: string;
  email: string;
  username: string;
  role: "Owner" | "Editor" | "Viewer";
  avatar?: string;
  code: string;
}

export interface AuthSlice {
  currentView: ViewType;
  activeWorkspaceTab: WorkspaceTab;
  theme: "light" | "dark";
  user: User | null;
  familyTreeCode: string | null;
  familyTreeName: string | null;
  isMobileSidebarOpen: boolean;
  isEmailSent: boolean;
  emailSentTo: string | null;
  isOtpVerified: boolean;
  otpVerificationEmail: string | null;
  otpCountdown: number;
  authMethod: "email" | "phone";
  authPhoneCountryCode: string;

  setMobileSidebarOpen: (open: boolean) => void;
  setView: (view: ViewType) => void;
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  toggleTheme: () => void;
  login: (email: string, name?: string, username?: string) => void;
  logout: () => void;
  joinTree: (code: string, treeName?: string) => void;
  createTree: (name: string) => void;
  forgotPassword: (emailOrPhone: string) => void;
  verifyOtp: (email: string, otp: string) => void;
  resetPassword: (email: string, password: string) => void;
  resendOtp: (emailOrPhone: string) => void;
  resetAuthState: () => void;
  setAuthMethod: (method: "email" | "phone") => void;
  setAuthPhoneCountryCode: (code: string) => void;
  completeAuthFlow: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  currentView: "landing",
  activeWorkspaceTab: "tree",
  theme: "light",
  user: null,
  familyTreeCode: null,
  familyTreeName: null,
  isMobileSidebarOpen: false,
  isEmailSent: false,
  emailSentTo: null,
  isOtpVerified: false,
  otpVerificationEmail: null,
  otpCountdown: 120,
  authMethod: "email",
  authPhoneCountryCode: "+976",

  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  setView: (view) => set({ currentView: view }),
  setWorkspaceTab: (tab) => set({ activeWorkspaceTab: tab }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setAuthMethod: (method) => set({ authMethod: method }),
  setAuthPhoneCountryCode: (code) => set({ authPhoneCountryCode: code }),

  login: (email, name, username?) => {
    setAuthCookie();
    return set({
      user: {
        name: name || "Bat-Erdene (Owner)",
        email,
        username: username ?? name ?? "user",
        role: "Owner",
        code: "SARTUUL-2026",
        avatar: "https://picsum.photos/seed/user/150/150",
      },
      familyTreeCode: "SARTUUL-2026",
      familyTreeName: "Sartuul Ogiin Bichig",
      currentView: "onboarding",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    });
  },

  logout: () => {
    clearAuthCookie();
    set({
      user: null,
      familyTreeCode: null,
      familyTreeName: null,
      currentView: "landing",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    });
  },

  joinTree: (code, treeName) => {
    setAuthCookie();
    return set((state) => ({
      user: state.user ? { ...state.user, role: "Editor" as const } : null,
      familyTreeCode: code,
      familyTreeName: treeName || "Collaborative Archive Tree",
      currentView: "workspace",
      activeWorkspaceTab: "tree",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    }));
  },

  createTree: (name) => {
    setAuthCookie();
    return set(() => {
      const code = `CEDIG-${Math.floor(Math.random() * 90000 + 10000)}`;
      return {
        familyTreeCode: code,
        familyTreeName: name,
        currentView: "workspace",
        activeWorkspaceTab: "tree",
        isEmailSent: false,
        emailSentTo: null,
        isOtpVerified: false,
        otpVerificationEmail: null,
      };
    });
  },

  forgotPassword: (emailOrPhone) =>
    set({
      isEmailSent: true,
      emailSentTo: emailOrPhone,
      otpCountdown: 120,
      currentView: "otp-verification",
    }),

  verifyOtp: (email, _otp) =>
    set({
      isOtpVerified: true,
      otpVerificationEmail: email,
      currentView: "reset-password",
    }),

  resetPassword: (_email, _password) =>
    set({
      currentView: "auth-success",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    }),

  resendOtp: (_emailOrPhone) =>
    set({
      otpCountdown: 120,
    }),

  completeAuthFlow: () =>
    set({
      currentView: "onboarding",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    }),

  resetAuthState: () =>
    set({
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
      otpCountdown: 120,
      authMethod: "email",
    }),
});
