"use client";
import { useMemo } from "react";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/src/store";
import { Pagination, SearchInput, EmptyState } from "@/src/components/shared";
import { useTabUrlState, usePaginatedData } from "@/src/hooks/useTabUrlState";

export default function PhotosPage() {
  const { people, media } = useAppStore();
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
                <div key={ph.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 group relative shadow-md">
                  <div className="relative h-48 w-full bg-[#ebdcb9]/40 border-b">
                    <Image src={ph.url} alt={ph.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-bold text-sm text-ink">{ph.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-pine/5 text-ink block truncate font-bold">{owner ? `${owner.firstName} ${owner.lastName}` : "Овгийн архив"}</span>
                    <p className="text-xs text-stone-500 leading-tight">{ph.description}</p>
                    <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-[11px] font-bold">
                      <span className="text-stone-400 font-normal">Хэмжээ: 2.4 MB</span>
                      <button onClick={() => { const link = document.createElement("a"); link.href = ph.url; link.download = ph.title; link.click(); }} className="text-bronze hover:underline flex items-center gap-1 cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
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
