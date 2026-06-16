import { api } from "@/src/lib/api";
import type { ActivityLog } from "@/src/types/activity";

export interface BackendActivity {
  id: string;
  treeId: string;
  type: string;
  description: string;
  personId: string | null;
  userId: string | null;
  userName: string;
  metadata?: unknown;
  createdAt: string;
  user?: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
    username: string;
  } | null;
}

function mapActivity(b: BackendActivity): ActivityLog {
  return {
    id: b.id,
    type: b.type as ActivityLog["type"],
    description: b.description,
    personId: b.personId || undefined,
    userName: b.userName,
    timestamp: b.createdAt || "",
    metadata: b.metadata as Record<string, unknown> | undefined,
    user: b.user || null,
  };
}

export interface FetchActivitiesResult {
  activities: ActivityLog[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchActivities(
  treeId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    from?: string;
    to?: string;
  },
): Promise<FetchActivitiesResult> {
  const params: Record<string, string | number> = {};
  if (options?.page) params.page = options.page;
  if (options?.limit) params.limit = options.limit;
  if (options?.search) params.search = options.search;
  if (options?.type) params.type = options.type;
  if (options?.from) params.from = options.from;
  if (options?.to) params.to = options.to;

  const response = await api.getPaginated<BackendActivity>(
    `/activity/${treeId}`,
    params,
  );

  const meta = response.pagination || (response as any).meta;
  return {
    activities: (response.data || []).map(mapActivity),
    total: meta?.totalItems || 0,
    page: meta?.currentPage || 1,
    limit: meta?.pageSize || 20,
  };
  
}
