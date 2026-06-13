"use client";
import { useMemo } from "react";
import { FileText, Download, FileSearch } from "lucide-react";
import { useAppStore } from "@/src/store";
import { Pagination, SearchInput, EmptyState } from "@/src/components/shared";
import { useTabUrlState, usePaginatedData } from "@/src/hooks/useTabUrlState";

export default function DocumentsPage() {
  const { people, media } = useAppStore();
  const docSearch = useTabUrlState("doc");

  const documentCabinet = useMemo(() => media.filter((m) => m.type !== "photo"), [media]);

  const filteredDocuments = useMemo(() => {
    const q = docSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return documentCabinet;
    return documentCabinet.filter((dc) => {
      const title = (dc.title || "").toLowerCase();
      const desc = (dc.description || "").toLowerCase();
      const type = (dc.type || "").toLowerCase();
      const owner = people.find((p) => p.id === dc.personId);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.toLowerCase() : "";
      return title.includes(q) || desc.includes(q) || type.includes(q) || ownerName.includes(q);
    });
  }, [documentCabinet, docSearch.debouncedQuery, people]);

  const { paginatedData, totalPages, totalItems } = usePaginatedData(filteredDocuments, docSearch.page);
  const isSearching = docSearch.query !== docSearch.debouncedQuery;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-bold">Бичиг баримтууд</h2>
        <SearchInput
          value={docSearch.query}
          onChange={docSearch.setQuery}
          placeholder="Баримт хайх (гарчиг, тайлбар)..."
          loading={isSearching}
          className="w-full sm:w-72"
        />
      </div>
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<FileSearch className="w-10 h-10" />}
          title="Баримт олдсонгүй."
          description={docSearch.debouncedQuery ? `"${docSearch.debouncedQuery}" хайлтаар тохирох баримт байхгүй байна.` : "Баримт хараахан хавсаргаагүй байна."}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-6">
            {paginatedData.map((dc) => {
              const owner = people.find((p) => p.id === dc.personId);
              return (
                <div key={dc.id} className="bg-white p-5 border border-stone-200 rounded-2xl flex items-start gap-4 shadow-sm hover:border-bronze/35 transition">
                  <div className="w-12 h-12 rounded-xl bg-bronze/10 text-bronze flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div>
                      <p className="font-bold text-sm text-ink">{dc.title}</p>
                      <span className="text-[10px] text-stone-400 font-bold block pt-0.5">Суурь баримт • CSV / JPG скан</span>
                    </div>
                    <p className="text-xs text-stone-500">{dc.description}</p>
                    <div className="flex justify-between items-center text-[10px] border-t border-stone-100 pt-3">
                      <span className="font-bold text-bronze">Гэрчлэгч: {owner ? `${owner.firstName} ${owner.lastName}` : "Овгийн сан"}</span>
                      <button onClick={() => { const link = document.createElement("a"); link.href = dc.url; link.download = dc.title; link.click(); }} className="text-ink font-bold hover:underline flex items-center gap-1">
                        <Download className="w-3 text-emerald-600 inline mr-0.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalItems > 10 && (
            <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
              <span>Нийт {totalItems} баримт</span>
              <Pagination currentPage={docSearch.page} totalPages={totalPages} onPageChange={docSearch.setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
