import { useAppStore } from "../../lib/store";
import type { MediaItem } from "@/src/types/media";

export function mediaService() {
  const store = useAppStore.getState();

  return {
    addMediaItem: (data: Omit<MediaItem, "id" | "uploadedAt" | "version">) =>
      store.addMediaItem(data),

    deleteMediaItem: (id: string) =>
      store.deleteMediaItem(id),
  };
}
