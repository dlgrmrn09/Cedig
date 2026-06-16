import type { StateCreator } from "zustand";
import type { MediaItem } from "@/src/types/media";
import { createMedia, deleteMedia } from "@/src/services/mediaService";

const initialMedia: MediaItem[] = [];

export interface MediaSlice {
  media: MediaItem[];
  addMediaItem: (data: Omit<MediaItem, "id" | "uploadedAt" | "version">) => void;
  deleteMediaItem: (id: string) => void;
  mergePersonMedia: (incoming: MediaItem[]) => void;

  addMediaItemAsync: (treeId: string, data: Omit<MediaItem, "id" | "uploadedAt" | "version">) => Promise<void>;
  deleteMediaItemAsync: (treeId: string, id: string) => Promise<void>;
}

export const createMediaSlice: StateCreator<MediaSlice, [], [], MediaSlice> = (set) => ({
  media: initialMedia,

  addMediaItem: (mediaData) =>
    set((state) => ({
      media: [
        {
          ...mediaData,
          id: `m-${Date.now()}`,
          uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          version: 1,
        },
        ...state.media,
      ],
    })),

  deleteMediaItem: (id) =>
    set((state) => ({
      media: state.media.filter((m) => m.id !== id),
    })),

  mergePersonMedia: (incoming) =>
    set((state) => {
      const existingIds = new Set(state.media.map((m) => m.id));
      const newItems = incoming.filter((item) => !existingIds.has(item.id));
      if (newItems.length === 0) return state;
      return { media: [...newItems, ...state.media] };
    }),

  addMediaItemAsync: async (treeId: string, mediaData) => {
    try {
      const newItem = await createMedia(treeId, {
        personId: mediaData.personId,
        title: mediaData.title,
        description: mediaData.description,
        type: mediaData.type,
        url: mediaData.url,
      });
      const frontendItem: MediaItem = {
        id: newItem.id,
        personId: newItem.personId,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        url: newItem.url,
        fileSize: newItem.fileSize,
        mimeType: newItem.mimeType,
        uploadedAt: newItem.uploadedAt,
        version: newItem.version,
      };
      set((s) => ({ media: [frontendItem, ...s.media] }));
    } catch (error) {
      console.error('Failed to add media:', error);
      throw error;
    }
  },

  deleteMediaItemAsync: async (treeId: string, id: string) => {
    try {
      await deleteMedia(id, treeId);
      set((s) => ({ media: s.media.filter((m) => m.id !== id) }));
    } catch (error) {
      console.error('Failed to delete media:', error);
      throw error;
    }
  },
});
