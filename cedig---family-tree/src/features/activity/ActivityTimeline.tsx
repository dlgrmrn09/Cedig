"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAppStore } from "@/src/store";
import { Clock, RotateCcw } from "lucide-react";
import { SearchInput, Pagination } from "@/src/components/shared";
import { useDebounce } from "@/hooks/use-debounce";

export function ActivityTimeline() {
  const { activities, addNotification } = useAppStore();

  const qKey = "activity_q";
  const pKey = "activity_page";

  const getInitialSearch = () => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get(qKey) || "";
  };

  const getInitialPage = () => {
    if (typeof window === "undefined") return 1;
    const p = parseInt(new URLSearchParams(window.location.search).get(pKey) || "1", 10);
    return isNaN(p) ? 1 : p;
  };

  const [search, setSearchInternal] = useState(getInitialSearch);
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPageInternal] = useState(getInitialPage);

  const setSearch = useCallback((newSearch: string) => {
    setSearchInternal(newSearch);
    setPageInternal(1);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedSearch) {
      url.searchParams.set(qKey, debouncedSearch);
    } else {
      url.searchParams.delete(qKey);
    }
    if (page > 1) {
      url.searchParams.set(pKey, String(page));
    } else {
      url.searchParams.delete(pKey);
    }
    window.history.replaceState({}, "", url.toString());
  }, [debouncedSearch, page]);

  const setPage = useCallback((p: number) => {
    setPageInternal(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter(
      (a) =>
        a.description.toLowerCase().includes(q) ||
        a.userName.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q),
    );
  }, [activities, debouncedSearch]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paginatedActivities = filtered.slice(start, start + pageSize);

  const handleRollback = (desc: string) => {
    if (confirm(`\"${desc}\" өөрчлөлтийг буцааж, өмнөх хувилбарт шилжих үү?`)) {
      addNotification(
        "success",
        "Сэргээлт амжилттай",
        "Архивын өгөгдөл хувилбарт амжилтай сэргэлээ.",
      );
    }
  };

  return (
    <div
      id="activity-workspace"
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-bronze" /> Timeline
          </h2>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Үйлдэл хайх (тайлбар, хэрэглэгч)..."
          loading={search !== debouncedSearch}
          className="w-full sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center p-8 text-stone-400 text-xs space-y-2">
          <Clock className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-bold">Мэдээлэл олдсонгүй.</p>
          {debouncedSearch && (
            <p className="text-stone-400">&ldquo;{debouncedSearch}&rdquo; хайлтаар тохирох үйлдэл байхгүй байна.</p>
          )}
        </div>
      ) : (
        <>
          <div className="relative border-l-2 border-bronze/20 pl-4 space-y-8 text-xs font-medium">
            {paginatedActivities.map((act) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-bronze" />

                <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-3 hover:border-bronze/40 transition">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-stone-800 text-sm leading-relaxed">
                      {act.description}
                    </p>

                    <button
                      onClick={() => handleRollback(act.description)}
                      className="flex items-center gap-1 border border-bronze/30 bg-bronze/10 text-bronze px-2 py-1 rounded text-[10px] font-bold hover:bg-opacity-20 shrink-0 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Буцаах
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-stone-400 border-t border-stone-150 pt-2 font-semibold">
                    <span className="flex items-center gap-1">
                      <b>{act.userName}</b>
                    </span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length > pageSize && (
            <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
              <span>Нийт {filtered.length} үйлдэл</span>
              <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
