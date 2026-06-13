import type { StateCreator } from "zustand";
import type { ActivityLog } from "@/src/types/activity";

const initialActivities: ActivityLog[] = [
  { id: "act1", type: "add", description: "Database initialized with historical ancestral Sartuul clan lines.", userName: "CEDIG Archival Bot", timestamp: "2026-06-10 10:00" },
  { id: "act2", type: "media_add", description: "Uploaded verified \"Historical Passport Scan\" for Demberel Bat-Erdene.", userName: "Admin User", personId: "1", timestamp: "2026-06-10 12:00" },
  { id: "act3", type: "edit", description: "Updated Enkhjargal D. biography profiles to note anatomist contributions.", userName: "Admin User", personId: "3", timestamp: "2026-06-10 13:02" },
];

export interface ActivitySlice {
  activities: ActivityLog[];
}

export const createActivitySlice: StateCreator<ActivitySlice, [], [], ActivitySlice> = () => ({
  activities: initialActivities,
});
