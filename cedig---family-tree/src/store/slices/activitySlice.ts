import type { StateCreator } from "zustand";
import type { ActivityLog } from "@/src/types/activity";
import { fetchActivities as fetchFromApi } from "@/src/services/activityService";

const initialActivities: ActivityLog[] = [];

export interface ActivitySlice {
  activities: ActivityLog[];
  activitiesLoading: boolean;
  activitiesTotal: number;
  activitiesPage: number;
  loadActivities: (treeId: string, options?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  setActivities: (activities: ActivityLog[]) => void;
}

export const createActivitySlice: StateCreator<ActivitySlice, [], [], ActivitySlice> = (set) => ({
  activities: initialActivities,
  activitiesLoading: false,
  activitiesTotal: 0,
  activitiesPage: 1,
  setActivities: (activities) => set({ activities }),
  loadActivities: async (treeId, options) => {
    set({ activitiesLoading: true });
    try {
      const result = await fetchFromApi(treeId, options);
      set({
        activities: result.activities,
        activitiesTotal: result.total,
        activitiesPage: result.page,
        activitiesLoading: false,
      });
    } catch {
      set({ activitiesLoading: false });
    }
  },
});
