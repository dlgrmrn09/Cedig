import type { StateCreator } from "zustand";
import type { ViewType, WorkspaceTab } from "@/src/types/common";
import { getMe, loginWithBackend, backendLogout, registerWithBackend, registerWithPhone } from "@/src/services/authService";
import { createTree as apiCreateTree, joinTree as apiJoinTree } from "@/src/services/familyService";
import { loginWithGoogle, loginWithFacebook, loginWithEmail, registerWithEmail, logout as firebaseLogout, sendVerificationEmail, sendResetPasswordEmail, reauthenticate, verifyThenUpdateEmail } from "@/src/lib/firebase";
import { api } from "@/src/lib/api";

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
  id: string;
  name: string;
  email: string;
  username: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  avatar?: string;
  code: string;
}

export interface TreeInfo {
  id: string;
  name: string;
  code: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
}

export interface AuthSlice {
  currentView: ViewType;
  activeWorkspaceTab: WorkspaceTab;
  theme: "light" | "dark";
  user: User | null;
  familyTreeCode: string | null;
  familyTreeId: string | null;
  familyTreeName: string | null;
  trees: TreeInfo[];
  isMobileSidebarOpen: boolean;
  isEmailSent: boolean;
  emailSentTo: string | null;
  isOtpVerified: boolean;
  otpVerificationEmail: string | null;
  otpCountdown: number;
  authMethod: "email" | "phone";
  authPhoneCountryCode: string;
  isLoading: boolean;
  phoneConfirmationResult: any;
  phoneVerificationSent: boolean;
  verifiedPhoneNumber: string | null;

  setMobileSidebarOpen: (open: boolean) => void;
  setView: (view: ViewType) => void;
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  toggleTheme: () => void;
  login: (email: string, name?: string, username?: string) => void;
  logout: () => void;
  joinTree: (code: string, treeName?: string) => void;
  createTree: (name: string) => void;
  forgotPassword: (emailOrPhone: string, recaptchaToken?: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => void;
  resetPassword: (email: string, password: string) => void;
  resendOtp: (emailOrPhone: string, recaptchaToken?: string) => void;
  resetAuthState: () => void;
  setAuthMethod: (method: "email" | "phone") => void;
  setAuthPhoneCountryCode: (code: string) => void;
  completeAuthFlow: () => void;
  setAvatar: (avatarUrl: string | null) => void;

  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailPasswordAndCaptcha: (email: string, password: string, recaptchaToken: string) => Promise<void>;
  registerWithEmailPassword: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    agreeTerms?: boolean,
    agreePrivacy?: boolean,
  ) => Promise<void>;
  registerWithEmailPasswordAndCaptcha: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    recaptchaToken: string,
    agreeTerms?: boolean,
    agreePrivacy?: boolean,
  ) => Promise<void>;
  registerWithPhonePassword: (
    firstName: string,
    lastName: string,
    username: string,
    phone: string,
    countryCode: string,
    password: string,
    agreeTerms?: boolean,
    agreePrivacy?: boolean,
  ) => Promise<void>;
  startPhoneVerification: (phone: string, countryCode: string) => Promise<void>;
  confirmPhoneOtp: (otp: string) => Promise<void>;
  clearPhoneVerification: () => void;
  reauthenticateUser: (email: string, password: string) => Promise<void>;
  changeEmailWithVerification: (newEmail: string) => Promise<void>;
  firebaseLogout: () => Promise<void>;
  loadUserData: () => Promise<void>;

  createTreeAsync: (name: string, clanName?: string) => Promise<void>;
  joinTreeAsync: (code: string) => Promise<void>;
  joinTreeAsyncWithCaptcha: (code: string, recaptchaToken: string) => Promise<void>;
  switchTree: (treeId: string) => void;
  loadUserTrees: () => Promise<void>;
  showCreateTreeForm: boolean;
  setShowCreateTreeForm: (show: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => ({
  currentView: "landing",
  activeWorkspaceTab: "tree",
  theme: "light",
  user: null,
  familyTreeCode: null,
  familyTreeId: null,
  familyTreeName: null,
  trees: [],
  isMobileSidebarOpen: false,
  isEmailSent: false,
  emailSentTo: null,
  isOtpVerified: false,
  otpVerificationEmail: null,
  otpCountdown: 120,
  authMethod: "email",
  authPhoneCountryCode: "+976",
  isLoading: false,
  showCreateTreeForm: false,
  phoneConfirmationResult: null,
  phoneVerificationSent: false,
  verifiedPhoneNumber: null,

  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  setView: (view) => set({ currentView: view }),
  setWorkspaceTab: (tab) => set({ activeWorkspaceTab: tab }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setAuthMethod: (method) => set({ authMethod: method }),
  setAuthPhoneCountryCode: (code) => set({ authPhoneCountryCode: code }),
  setAvatar: (avatarUrl) => set((state) => ({ user: state.user ? { ...state.user, avatar: avatarUrl || undefined } : null })),
  setShowCreateTreeForm: (show) => set({ showCreateTreeForm: show }),

  login: (email, name, username?) => {
    setAuthCookie();
    return set({
      user: {
        id: '',
        name: name || email.split('@')[0] || "User",
        email,
        username: username ?? name ?? email.split('@')[0] ?? "user",
        role: "Owner",
        code: "",
        avatar: undefined,
      },
      familyTreeCode: null,
      familyTreeName: null,
      familyTreeId: null,
      trees: [],
      currentView: "workspace",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    });
  },

  logout: () => {
    console.log('[AUTH] Logout clicked');
    clearAuthCookie();
    api.clearToken();
    set({
      user: null,
      familyTreeCode: null,
      familyTreeId: null,
      familyTreeName: null,
      trees: [],
      currentView: "landing",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    });

    console.log('[AUTH] Firebase signOut started');
    firebaseLogout()
      .then(() => {
        console.log('[AUTH] Firebase signOut success');
        console.log('[AUTH] Local auth cleared');
      })
      .catch((error) => {
        console.error('[AUTH] Firebase signOut failed:', error);
      });

    backendLogout()
      .then(() => {
        console.log('[AUTH] Backend logout success');
      })
      .catch(() => {
        // Backend logout is best-effort
      });
  },

  joinTree: (code, treeName) => {
    setAuthCookie();
    set((state) => ({
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
    const code = `CEDIG-${Math.floor(Math.random() * 90000 + 10000)}`;
    return set({
      familyTreeCode: code,
      familyTreeName: name,
      familyTreeId: null,
      currentView: "workspace",
      activeWorkspaceTab: "tree",
      isEmailSent: false,
      emailSentTo: null,
      isOtpVerified: false,
      otpVerificationEmail: null,
    });
  },

  forgotPassword: async (emailOrPhone: string, _recaptchaToken?: string) => {
    set({ isLoading: true });
    try {
      console.log('[AUTH] forgotPassword started', { emailOrPhone });
      if (emailOrPhone.includes('@')) {
        await sendResetPasswordEmail(emailOrPhone);
      } else {
        await sendResetPasswordEmail(`${emailOrPhone}@phone.cedig.mn`);
      }
      console.log('[AUTH] forgotPassword success - Firebase email sent');
      set({
        isEmailSent: true,
        emailSentTo: emailOrPhone,
        currentView: "reset-password-sent",
        isLoading: false,
      });
    } catch (error) {
      console.error('[AUTH] forgotPassword failed:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  resendVerificationEmail: async () => {
    const { emailSentTo } = get();
    const email = emailSentTo || get().user?.email;
    if (!email) return;
    set({ isLoading: true });
    try {
      const { auth } = await import("@/src/lib/firebase");
      const { sendVerificationEmail: fbSendVerify } = await import("@/src/lib/firebase");
      const currentUser = auth.currentUser;
      if (currentUser) {
        await fbSendVerify(currentUser);
      }
      set({ isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  checkEmailVerified: async () => {
    const { auth } = await import("@/src/lib/firebase");
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    await currentUser.reload();
    return currentUser.emailVerified;
  },

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
      currentView: "workspace",
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

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('[AUTH] Google login failed:', error);
      set({ isLoading: false });
    }
  },

  loginWithFacebook: async () => {
    set({ isLoading: true });
    try {
      await loginWithFacebook();
    } catch (error) {
      console.error('[AUTH] Facebook login failed:', error);
      set({ isLoading: false });
    }
  },

  loginWithEmailPassword: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user: firebaseUser, token } = await loginWithEmail(email, password);

      if (!firebaseUser.emailVerified) {
        set({
          emailSentTo: email,
          currentView: "verify-email",
          isLoading: false,
        });
        return;
      }

      api.setToken(token);

      try {
      const backendResult = await loginWithBackend(email, password);
      if (backendResult.refreshToken) {
        api.setRefreshToken(backendResult.refreshToken);
      }
    } catch (backendError) {
        console.error('[AUTH] Backend login sync failed:', backendError);
      }

      const result = await getMe();
      if (result?.user) {
        setAuthCookie();
        const treesWithRoles = result.trees.map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          role: (t.role || 'Viewer') as TreeInfo['role'],
        }));

        const ownedTrees = treesWithRoles.filter((t) => t.role === 'Owner');
        const sharedTrees = treesWithRoles.filter((t) => t.role !== 'Owner');

        let activeTreeId: string | null = null;
        if (ownedTrees.length > 0) {
          activeTreeId = ownedTrees[0].id;
        } else if (sharedTrees.length > 0) {
          activeTreeId = sharedTrees[0].id;
        }

        const activeTree = treesWithRoles.find((t) => t.id === activeTreeId);

        set({
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            username: result.user.name.split(' ')[0] || 'user',
            role: result.user.role as User['role'],
            avatar: result.user.avatar,
            code: result.user.code,
          },
          familyTreeCode: activeTree ? activeTree.code : null,
          familyTreeId: activeTree ? activeTree.id : null,
          familyTreeName: activeTree ? activeTree.name : null,
          trees: treesWithRoles,
          currentView: "workspace",
        });
        console.log('[AUTH] Email login complete', {
          userId: result.user.id,
          email: result.user.email,
          ownedCount: ownedTrees.length,
          sharedCount: sharedTrees.length,
          treeCount: result.trees.length,
          targetView: "workspace",
          activeTree: activeTree?.name,
        });
      } else {
        set({
          trees: [],
          currentView: "workspace",
        });
        console.log('[AUTH] Email login complete (no backend profile)', { email, targetView: "workspace" });
      }
    } catch (error) {
      console.error('[AUTH] Email login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithEmailPasswordAndCaptcha: async (email: string, password: string, recaptchaToken: string) => {
    set({ isLoading: true });
    try {
      const { user: firebaseUser, token } = await loginWithEmail(email, password);

      if (!firebaseUser.emailVerified) {
        set({
          emailSentTo: email,
          currentView: "verify-email",
          isLoading: false,
        });
        return;
      }

      api.setToken(token);

      try {
      const backendResult = await loginWithBackend(email, password, recaptchaToken);
      if (backendResult.refreshToken) {
        api.setRefreshToken(backendResult.refreshToken);
      }
    } catch (backendError) {
        console.error('[AUTH] Backend login sync failed (captcha):', backendError);
      }

      const result = await getMe();
      if (result?.user) {
        setAuthCookie();
        const treesWithRoles = result.trees.map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          role: (t.role || 'Viewer') as TreeInfo['role'],
        }));

        const ownedTrees = treesWithRoles.filter((t) => t.role === 'Owner');
        const sharedTrees = treesWithRoles.filter((t) => t.role !== 'Owner');

        let activeTreeId: string | null = null;
        if (ownedTrees.length > 0) {
          activeTreeId = ownedTrees[0].id;
        } else if (sharedTrees.length > 0) {
          activeTreeId = sharedTrees[0].id;
        }

        const activeTree = treesWithRoles.find((t) => t.id === activeTreeId);

        set({
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            username: result.user.name.split(' ')[0] || 'user',
            role: result.user.role as User['role'],
            avatar: result.user.avatar,
            code: result.user.code,
          },
          familyTreeCode: activeTree ? activeTree.code : null,
          familyTreeId: activeTree ? activeTree.id : null,
          familyTreeName: activeTree ? activeTree.name : null,
          trees: treesWithRoles,
          currentView: "workspace",
        });
        console.log('[AUTH] Email login complete', {
          userId: result.user.id,
          email: result.user.email,
          recaptcha: true,
        });
      } else {
        set({ trees: [], currentView: "workspace" });
      }
    } catch (error) {
      console.error('[AUTH] Email login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  registerWithEmailPassword: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    agreeTerms = true,
    agreePrivacy = true,
  ) => {
    set({ isLoading: true });
    try {
      console.log('[AUTH] Starting registration flow', { email, username });

      const { user: firebaseUser, token } = await registerWithEmail(email, password);
      api.setToken(token);

      await sendVerificationEmail(firebaseUser);
      console.log('[AUTH] Verification email sent', { email });

      console.log('[AUTH] Firebase auth created, registering with backend');

      const backendResult = await registerWithBackend({
        firstName,
        lastName,
        username,
        email,
        password,
        agreeTerms,
        agreePrivacy,
      });

      api.setRefreshToken(backendResult.refreshToken);

      console.log('[AUTH] Registration complete - waiting for email verification', {
        userId: backendResult.user.id,
        treeCode: backendResult.familyTree?.code,
      });

      set({
        emailSentTo: email,
        currentView: "verify-email",
      });
    } catch (error) {
      console.error('[AUTH] Email registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  registerWithEmailPasswordAndCaptcha: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    recaptchaToken: string,
    agreeTerms = true,
    agreePrivacy = true,
  ) => {
    set({ isLoading: true });
    try {
      console.log('[AUTH] Starting registration flow with reCAPTCHA', { email, username });

      const { user: firebaseUser, token } = await registerWithEmail(email, password);
      api.setToken(token);

      await sendVerificationEmail(firebaseUser);
      console.log('[AUTH] Verification email sent', { email });

      console.log('[AUTH] Firebase auth created, registering with backend');

      const backendResult = await registerWithBackend({
        firstName,
        lastName,
        username,
        email,
        password,
        agreeTerms,
        agreePrivacy,
      }, recaptchaToken);

      api.setRefreshToken(backendResult.refreshToken);

      console.log('[AUTH] Registration complete - waiting for email verification', {
        userId: backendResult.user.id,
        treeCode: backendResult.familyTree?.code,
        recaptcha: true,
      });

      set({
        emailSentTo: email,
        currentView: "verify-email",
      });
    } catch (error) {
      console.error('[AUTH] Email registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  startPhoneVerification: async (phone: string, countryCode: string) => {
    // Prevent concurrent verification flows which cause "already been rendered" errors
    const lock = (window as any).__recaptchaVerifyingLock;
    if (lock) {
      throw new Error("Verification already in progress. Please wait.");
    }
    (window as any).__recaptchaVerifyingLock = true;

    set({ isLoading: true });
    try {
      const { auth, RecaptchaVerifier, signInWithPhoneNumber } = await import("@/src/lib/firebase");

      // Destroy any existing verifier and ensure the container DOM is clean
      const existingVerifier = (window as any).__recaptchaVerifier;
      if (existingVerifier) {
        try { existingVerifier.clear(); } catch { /* ignore */ }
        delete (window as any).__recaptchaVerifier;
      }

      // Manually clear the container element to prevent "already been rendered" errors
      // when Firebase's grecaptcha.render() is called on an occupied element
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      (window as any).__recaptchaVerifier = verifier;

      const fullPhone = `${countryCode}${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, verifier);

      set({
        phoneConfirmationResult: confirmationResult,
        phoneVerificationSent: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, phoneVerificationSent: false, phoneConfirmationResult: null });
      throw error;
    } finally {
      delete (window as any).__recaptchaVerifyingLock;
    }
  },

  confirmPhoneOtp: async (otp: string) => {
    const { phoneConfirmationResult } = get();
    if (!phoneConfirmationResult) throw new Error("No pending verification");

    set({ isLoading: true });
    try {
      const result = await phoneConfirmationResult.confirm(otp);
      const phoneNumber = result.user.phoneNumber;
      set({
        verifiedPhoneNumber: phoneNumber,
        phoneConfirmationResult: null,
        phoneVerificationSent: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearPhoneVerification: () => {
    const verifier = (window as any).__recaptchaVerifier;
    if (verifier) {
      try { verifier.clear(); } catch { /* ignore */ }
      delete (window as any).__recaptchaVerifier;
    }
    // Clean the container DOM to prevent "already been rendered" on next use
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
    set({
      phoneConfirmationResult: null,
      phoneVerificationSent: false,
      verifiedPhoneNumber: null,
    });
  },

  reauthenticateUser: async (email: string, password: string) => {
    await reauthenticate(email, password);
    console.log('[AUTH] User re-authenticated successfully');
  },

  changeEmailWithVerification: async (newEmail: string) => {
    await verifyThenUpdateEmail(newEmail);
    set((state) => ({
      user: state.user ? { ...state.user, email: newEmail } : null,
    }));
    console.log('[AUTH] Email change verification sent', { newEmail });
  },

  registerWithPhonePassword: async (
    firstName: string,
    lastName: string,
    username: string,
    phone: string,
    countryCode: string,
    password: string,
    agreeTerms = true,
    agreePrivacy = true,
  ) => {
    set({ isLoading: true });
    try {
      const { verifiedPhoneNumber } = get();
      if (!verifiedPhoneNumber) {
        throw new Error("Phone not verified. Please verify your phone number first.");
      }

      console.log('[AUTH] Starting phone registration with verified phone', { phone });

      const syntheticEmail = `${countryCode}${phone}@phone.cedig.mn`;
      const { user: firebaseUser, token } = await registerWithEmail(
        syntheticEmail,
        password,
      );

      const { linkWithCredential, PhoneAuthProvider } = await import("@/src/lib/firebase");
      const { phoneConfirmationResult } = get();
      if (phoneConfirmationResult) {
        const phoneCredential = PhoneAuthProvider.credential(
          phoneConfirmationResult.verificationId,
          "",
        );
        try {
          await linkWithCredential(firebaseUser, phoneCredential);
        } catch {
          console.warn("Phone credential linking skipped — phone already verified via sign-in");
        }
      }

      api.setToken(token);

      console.log('[AUTH] Firebase auth created with phone, registering with backend');

      const backendResult = await registerWithPhone({
        firstName,
        lastName,
        username,
        phone,
        countryCode,
        password,
        agreeTerms,
        agreePrivacy,
      });

      api.setRefreshToken(backendResult.refreshToken);
      setAuthCookie();

      set({
        user: {
          id: backendResult.user.id,
          name: backendResult.user.name,
          email: backendResult.user.email,
          username: backendResult.user.username || username,
          role: backendResult.user.role as User['role'],
          avatar: backendResult.user.avatar,
          code: backendResult.user.code,
        },
        familyTreeCode: backendResult.familyTree?.code || null,
        familyTreeId: backendResult.familyTree?.id || null,
        familyTreeName: backendResult.familyTree?.name || null,
        trees: backendResult.familyTree
          ? [{ id: backendResult.familyTree.id, name: backendResult.familyTree.name, code: backendResult.familyTree.code, role: "Owner" as const }]
          : [],
        currentView: "workspace",
        phoneConfirmationResult: null,
        phoneVerificationSent: false,
        verifiedPhoneNumber: null,
      });

      const verifier = (window as any).__recaptchaVerifier;
      if (verifier) {
        try { verifier.clear(); } catch { /* ignore */ }
        delete (window as any).__recaptchaVerifier;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      console.log('[AUTH] Phone registration complete', {
        userId: backendResult.user.id,
        treeCode: backendResult.familyTree?.code,
      });
    } catch (error) {
      console.error('[AUTH] Phone registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  firebaseLogout: async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error('Firebase logout failed:', error);
    }
    get().logout();
  },

  loadUserData: async () => {
    try {
      const result = await getMe();
      if (result?.user) {
        setAuthCookie();
        const treesWithRoles = result.trees.map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          role: (t.role || 'Viewer') as TreeInfo['role'],
        }));

        const ownedTrees = treesWithRoles.filter((t) => t.role === 'Owner');
        const sharedTrees = treesWithRoles.filter((t) => t.role !== 'Owner');

        const savedTreeId = typeof window !== "undefined"
          ? localStorage.getItem("cedig_active_tree")
          : null;

        let activeTreeId: string | null = null;
        if (ownedTrees.length > 0) {
          activeTreeId = savedTreeId && ownedTrees.find((t) => t.id === savedTreeId)
            ? savedTreeId
            : ownedTrees[0].id;
        } else if (sharedTrees.length > 0) {
          activeTreeId = savedTreeId && sharedTrees.find((t) => t.id === savedTreeId)
            ? savedTreeId
            : sharedTrees[0].id;
        }

        const activeTree = treesWithRoles.find((t) => t.id === activeTreeId);

        set({
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            username: result.user.name.split(' ')[0] || 'user',
            role: result.user.role as User['role'],
            avatar: result.user.avatar,
            code: result.user.code,
          },
          familyTreeCode: activeTree ? activeTree.code : null,
          familyTreeId: activeTree ? activeTree.id : null,
          familyTreeName: activeTree ? activeTree.name : null,
          trees: treesWithRoles,
          currentView: "workspace",
        });
        console.log('[AUTH] User data loaded', {
          userId: result.user.id,
          ownedCount: ownedTrees.length,
          sharedCount: sharedTrees.length,
          treeCount: result.trees.length,
          currentView: "workspace",
          activeTree: activeTree?.name,
        });
      }
    } catch (error) {
      console.error('[AUTH] Failed to load user data:', error);
    }
  },

  createTreeAsync: async (name: string, clanName?: string) => {
    set({ isLoading: true });
    try {
      const tree = await apiCreateTree(name, clanName);
      setAuthCookie();
      set((state) => ({
        familyTreeCode: tree.code,
        familyTreeId: tree.id,
        familyTreeName: tree.name,
        trees: [...state.trees, { id: tree.id, name: tree.name, code: tree.code, role: "Owner" as const }],
        currentView: "workspace",
        activeWorkspaceTab: "tree",
        user: state.user ? {
          ...state.user,
          code: tree.code,
        } : null,
      }));
    } catch (error) {
      console.error('Failed to create tree:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  joinTreeAsync: async (code: string) => {
    set({ isLoading: true });
    try {
      const result = await apiJoinTree(code);
      set({
        currentView: "workspace",
        activeWorkspaceTab: "tree",
      });
      if (result && (result as any).treeId) {
        get().loadUserTrees();
      }
      console.log('[AUTH] Join request submitted', { code, result });
    } catch (error) {
      console.error('Failed to join tree:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  joinTreeAsyncWithCaptcha: async (code: string, recaptchaToken: string) => {
    set({ isLoading: true });
    try {
      const result = await apiJoinTree(code, recaptchaToken);
      set({
        currentView: "workspace",
        activeWorkspaceTab: "tree",
      });
      if (result && (result as any).treeId) {
        get().loadUserTrees();
      }
      console.log('[AUTH] Join request submitted with reCAPTCHA', { code, result });
    } catch (error) {
      console.error('Failed to join tree:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  switchTree: (treeId: string) => {
    const state = get();
    const tree = state.trees.find((t) => t.id === treeId);
    if (!tree) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("cedig_active_tree", treeId);
    }

    (set as any)({
      familyTreeId: tree.id,
      familyTreeCode: tree.code,
      familyTreeName: tree.name,
      activeWorkspaceTab: "tree",
      peopleLoaded: false,
    });

    console.log('[AUTH] Switched to tree', { treeId, name: tree.name });
  },

  loadUserTrees: async () => {
    try {
      const { getMe } = await import("@/src/services/authService");
      const result = await getMe();
      if (result) {
        const treesWithRoles = result.trees.map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          role: (t.role || 'Viewer') as TreeInfo['role'],
        }));

        const ownedTrees = treesWithRoles.filter((t) => t.role === 'Owner');
        const sharedTrees = treesWithRoles.filter((t) => t.role !== 'Owner');

        const savedTreeId = typeof window !== "undefined"
          ? localStorage.getItem("cedig_active_tree")
          : null;

        let activeTreeId: string | null = null;
        if (ownedTrees.length > 0) {
          activeTreeId = savedTreeId && ownedTrees.find((t) => t.id === savedTreeId)
            ? savedTreeId
            : ownedTrees[0].id;
        } else if (sharedTrees.length > 0) {
          activeTreeId = savedTreeId && sharedTrees.find((t) => t.id === savedTreeId)
            ? savedTreeId
            : sharedTrees[0].id;
        }

        const activeTree = treesWithRoles.find((t) => t.id === activeTreeId);

        set({
          trees: treesWithRoles,
          familyTreeId: activeTree ? activeTree.id : null,
          familyTreeCode: activeTree ? activeTree.code : null,
          familyTreeName: activeTree ? activeTree.name : null,
          user: get().user ? {
            ...get().user!,
            role: activeTree?.role || get().user!.role,
          } : null,
        });
      }
    } catch (error) {
      console.error('[AUTH] Failed to load user trees:', error);
    }
  },
});
