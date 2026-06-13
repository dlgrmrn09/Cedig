import type { StateCreator } from "zustand";
import type { MediaItem } from "@/src/types/media";

const initialMedia: MediaItem[] = [
  { id: "m1", personId: "1", title: "Historical Passport Scan", description: "Scanned vintage document displaying traditional Sartuul seal approval in early Ulaanbaatar state office.", type: "document", url: "https://picsum.photos/seed/doc1/600/400", uploadedAt: "2026-06-10 12:00", version: 1 },
  { id: "m2", personId: "1", title: "Lineage Archives Photo", description: "Archive photo showing academic papers with Demberel Bat-Erdene sitting in archival hall.", type: "photo", url: "https://picsum.photos/seed/photo1/600/400", uploadedAt: "2026-06-10 12:15", version: 1 },
  { id: "m3", personId: "2", title: "Birth Certificate", description: "State birth certificate proving link between Bat-Erdene Demberel and Ganbold.", type: "certificate", url: "https://picsum.photos/seed/cert1/600/400", uploadedAt: "2026-06-10 12:30", version: 1 },
  { id: "m4", personId: "3", title: "Arkhangai Oral History Notes", description: "Scanned notebooks summarizing oral traditions recorded with ancient script.", type: "document", url: "https://picsum.photos/seed/doc2/600/400", uploadedAt: "2026-06-10 13:00", version: 1 },
];

export interface MediaSlice {
  media: MediaItem[];
  addMediaItem: (data: Omit<MediaItem, "id" | "uploadedAt" | "version">) => void;
  deleteMediaItem: (id: string) => void;
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
});
