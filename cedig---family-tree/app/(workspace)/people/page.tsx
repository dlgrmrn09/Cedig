"use client";
import { useMemo } from "react";
import { MoveRight, SearchIcon } from "lucide-react";
import { useAppStore } from "@/src/store";
import { Pagination, SearchInput, EmptyState } from "@/src/components/shared";
import { useTabUrlState, usePaginatedData } from "@/src/hooks/useTabUrlState";

export default function PeoplePage() {
  const { people, setActivePersonId, setWorkspaceTab } = useAppStore();
  const bioSearch = useTabUrlState("people");

  const filteredBiographies = useMemo(() => {
    const q = bioSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const bio = (p.biography || "").toLowerCase();
      const clan = (p.clanName || "").toLowerCase();
      const occupation = (p.occupation || "").toLowerCase();
      const awards = (p.awards || []).join(" ").toLowerCase();
      const education = (p.education || "").toLowerCase();
      return fullName.includes(q) || bio.includes(q) || clan.includes(q) || occupation.includes(q) || awards.includes(q) || education.includes(q);
    });
  }, [people, bioSearch.debouncedQuery]);

  const { paginatedData, totalPages, totalItems } = usePaginatedData(filteredBiographies, bioSearch.page);
  const isSearching = bioSearch.query !== bioSearch.debouncedQuery;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-bold">Хүмүүс</h2>
        <SearchInput
          value={bioSearch.query}
          onChange={bioSearch.setQuery}
          placeholder="Хүн хайх (нэр, тодорхойлолт)..."
          loading={isSearching}
          className="w-full sm:w-72"
        />
      </div>
      {filteredBiographies.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="w-10 h-10" />}
          title="Хүн олдсонгүй."
          description={bioSearch.debouncedQuery ? `"${bioSearch.debouncedQuery}" хайлтаар тохирох хүн байхгүй байна.` : "Одоогоор бүртгэгдсэн хүн байхгүй байна."}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-stone-150 p-6 flex flex-col justify-between hover:shadow-lg transition space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-ink">{p.firstName} {p.lastName}</h3>
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed italic">
                    &ldquo;{p.biography || "Товч намтар хараахан тэмдэглэгдээгүй байна."}&rdquo;
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold pt-4 border-t border-stone-100">
                  <span className="text-stone-400">Төрсөн он: {p.birthYear}</span>
                  <button
                    onClick={() => { setActivePersonId(p.id); setWorkspaceTab("tree"); }}
                    className="flex items-center gap-1 bg-pine text-vellum px-3.5 py-1.5 rounded shadow-sm text-xs font-bold hover:bg-opacity-95"
                  >
                    Read <MoveRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalItems > 10 && (
            <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
              <span>Нийт {totalItems} хүн</span>
              <Pagination currentPage={bioSearch.page} totalPages={totalPages} onPageChange={bioSearch.setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
