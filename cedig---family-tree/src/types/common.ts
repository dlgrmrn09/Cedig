export type ViewType = 'landing' | 'login' | 'register' | 'forgot-password' | 'otp-verification' | 'reset-password' | 'auth-success' | 'onboarding' | 'workspace';

export type WorkspaceTab = 'tree' | 'biographies' | 'photos' | 'documents' | 'activity' | 'access' | 'settings' | 'admin' | 'pricing';

export type Theme = 'light' | 'dark';

export interface FilterState {
  searchQuery: string;
  selectedClan: string;
  yearRange: [number, number];
  verifiedOnly: boolean;
  pendingOralHistoryOnly: boolean;
}

export type BillingPeriod = 'monthly' | 'yearly';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PersonNodeData {
  person: import('./person').Person;
  isHighlighted: boolean;
  isActive: boolean;
  activePathIds: Set<string>;
  setActivePersonId: (id: string | null) => void;
  setAddingRelation: (id: string | null, type: import('./person').AddingRelationType) => void;
  onHoverEnter: (e: React.MouseEvent, person: import('./person').Person) => void;
  onHoverLeave: () => void;
}

export interface MarriageNodeData {
  p1: import('./person').Person;
  p2: import('./person').Person;
  isCollapsed: boolean;
  hasChildren: boolean;
  onToggleCollapse: () => void;
}
