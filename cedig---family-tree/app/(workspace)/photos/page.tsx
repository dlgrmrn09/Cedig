"use client";
import { useMemo, useState, useCallback } from "react";
import { Download, ImageIcon, ImageOff } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/src/store";
import { Pagination, SearchInput, EmptyState } from "@/src/components/shared";
import { PhotoGridSkeleton } from "@/src/components/SkeletonLoader";
import { useTabUrlState, usePaginatedData } from "@/src/hooks/useTabUrlState";

function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PhotosPage() {
  const peopleLoaded = useAppStore((s) => s.peopleLoaded);
  const people = useAppStore((s) => s.people);
  const media = useAppStore((s) => s.media);
  const photoSearch = useTabUrlState("photo");

  const photoArchives = useMemo(() => media.filter((m) => m.type === "photo"), [media]);

  const filteredPhotos = useMemo(() => {
    const q = photoSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return photoArchives;
    return photoArchives.filter((ph) => {
      const title = (ph.title || "").toLowerCase();
      const desc = (ph.description || "").toLowerCase();
      const owner = people.find((p) => p.id === ph.personId);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.toLowerCase() : "";
      const type = (ph.type || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || ownerName.includes(q) || type.includes(q);
    });
  }, [photoArchives, photoSearch.debouncedQuery, people]);

  const { paginatedData, totalPages, totalItems } = usePaginatedData(filteredPhotos, photoSearch.page);
  const isSearching = photoSearch.query !== photoSearch.debouncedQuery;

  if (!peopleLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-display font-bold">Гэрэл зургийн цомог</h2>
        </div>
        <PhotoGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-bold">Гэрэл зургийн цомог</h2>
        <SearchInput
          value={photoSearch.query}
          onChange={photoSearch.setQuery}
          placeholder="Зураг хайх (гарчиг, тайлбар)..."
          loading={isSearching}
          className="w-full sm:w-72"
        />
      </div>
      {filteredPhotos.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-10 h-10" />}
          title="Зураг олдсонгүй."
          description={photoSearch.debouncedQuery ? `"${photoSearch.debouncedQuery}" хайлтаар тохирох зураг байхгүй байна.` : "Одоогоор цомогт зураг байхгүй байна."}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-6">
            {paginatedData.map((ph) => {
              const owner = people.find((p) => p.id === ph.personId);
              return (
                <PhotoCard key={ph.id} photo={ph} owner={owner} />
              );
            })}
          </div>
          {totalItems > 10 && (
            <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
              <span>Нийт {totalItems} зураг</span>
              <Pagination currentPage={photoSearch.page} totalPages={totalPages} onPageChange={photoSearch.setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PhotoCard({ photo: ph, owner }: { photo: import("@/src/types/media").MediaItem; owner: import("@/src/types/person").Person | undefined }) {
  const [imgError, setImgError] = useState(false);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = ph.url;
    link.download = ph.title;
    link.click();
  }, [ph.url, ph.title]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 group relative shadow-md">
      <div className="relative h-48 w-full bg-[#ebdcb9]/40 border-b">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs mt-1">Зураг ачаалах боломжгүй</span>
          </div>
        ) : (
          <Image
            src={ph.url}
            alt={ph.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="font-bold text-sm text-ink">{ph.title}</p>
        <span className="text-[10px] px-2 py-0.5 rounded bg-pine/5 text-ink block truncate font-bold">{owner ? `${owner.firstName} ${owner.lastName}` : "Овгийн архив"}</span>
        <p className="text-xs text-stone-500 leading-tight">{ph.description}</p>
        <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-[11px] font-bold">
          <span className="text-stone-400 font-normal">{ph.fileSize ? `Хэмжээ: ${formatFileSize(ph.fileSize)}` : ""}</span>
          <button onClick={handleDownload} className="text-bronze hover:underline flex items-center gap-1 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
