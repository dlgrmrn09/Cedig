"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAppStore } from "@/src/store";
import { Clock, Loader2, Filter, X, CalendarDays } from "lucide-react";
import { SearchInput, Pagination } from "@/src/components/shared";
import { useDebounce } from "@/hooks/use-debounce";
import Avatar from "@/src/components/shared/Avatar";
import { fetchActivities } from "@/src/services/activityService";
import type { ActivityLog } from "@/src/types/activity";

const PAGE_SIZE = 20;

const TYPE_OPTIONS = [
  { value: "", label: "Бүгд" },
  { value: "create", label: "Нэмсэн" },
  { value: "edit", label: "Засварласан" },
  { value: "delete", label: "Устгасан" },
] as const;

const DATE_PRESETS = [
  { value: "", label: "Бүх хугацаа" },
  { value: "today", label: "Өнөөдөр" },
  { value: "7days", label: "7 хоног" },
  { value: "30days", label: "30 хоног" },
  { value: "year", label: "1 жил" },
  { value: "custom", label: "Custom" },
] as const;

function getDateRange(preset: string): { from: string; to: string } {
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  switch (preset) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { from: start.toISOString(), to: endOfToday.toISOString() };
    }
    case "7days": {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { from: start.toISOString(), to: endOfToday.toISOString() };
    }
    case "30days": {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { from: start.toISOString(), to: endOfToday.toISOString() };
    }
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { from: start.toISOString(), to: endOfToday.toISOString() };
    }
    default:
      return { from: "", to: "" };
  }
}

function formatTimestamp(isoString: string): {
  relative: string;
  exact: string;
  full: string;
} {
  if (!isoString) return { relative: "", exact: "", full: "" };

  const date = new Date(isoString);
  if (isNaN(date.getTime()))
    return { relative: isoString, exact: isoString, full: isoString };

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let relative: string;
  if (diffMin < 1) relative = "дөнгөж сая";
  else if (diffMin < 60) relative = `${diffMin} минутын өмнө`;
  else if (diffHrs < 24) relative = `${diffHrs} цагийн өмнө`;
  else if (diffDays === 1) relative = "Өчигдөр";
  else if (diffDays < 7) relative = `${diffDays} өдрийн өмнө`;
  else
    relative = date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const exact = date.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = date.toLocaleTimeString("mn-MN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const full = `${exact} • ${time}`;

  return { relative, exact, full };
}

export function ActivityTimeline() {
  const { familyTreeId } = useAppStore();

  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageInternal] = useState(1);
  const [search, setSearchInternal] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [datePreset, setDatePreset] = useState<string>("");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const setSearch = useCallback((v: string) => {
    setSearchInternal(v);
    setPageInternal(1);
  }, []);

  const setPage = useCallback((p: number) => {
    setPageInternal(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hasActiveFilters =
    typeFilter !== "" ||
    datePreset !== "" ||
    ((datePreset as string) === "custom" && (customFrom !== "" || customTo !== ""));

  const handleClearFilters = useCallback(() => {
    setTypeFilter("");
    setDatePreset("");
    setCustomFrom("");
    setCustomTo("");
    setPageInternal(1);
  }, []);

  const dateRange = useMemo(() => {
    if (datePreset === "custom") {
      return {
        from: customFrom ? new Date(customFrom).toISOString() : "",
        to: customTo ? new Date(customTo + "T23:59:59.999").toISOString() : "",
      };
    }
    return getDateRange(datePreset);
  }, [datePreset, customFrom, customTo]);

  useEffect(() => {
    if (!familyTreeId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchActivities(familyTreeId, {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      type: typeFilter || undefined,
      from: dateRange.from || undefined,
      to: dateRange.to || undefined,
    })
      .then((result) => {
        if (cancelled) return;
        setActivities(result.activities);
        setTotal(result.total);
        console.log("Fetched activities:", result);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Үйл ажиллагааг ачаалахад алдаа гарлаа. Дахин оролдоно уу.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    familyTreeId,
    page,
    debouncedSearch,
    typeFilter,
    dateRange.from,
    dateRange.to,
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  console.log({
    activities,
    total,
    page,
    debouncedSearch,
    typeFilter,
    dateRange,
  });
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-bronze" /> Үйл ажиллагаа
          </h2>
          {total > 0 && (
            <p className="text-xs text-stone-400 mt-1">Нийт {total}</p>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Үйлдэл хайх..."
            loading={search !== debouncedSearch}
            className="w-full sm:w-56"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
              showFilters || hasActiveFilters
                ? "bg-pine text-white border-pine"
                : "border-stone-200 text-stone-500 hover:border-stone-300 hover:text-ink"
            }`}
            title="Шүүлтүүр"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                Төрөл:
              </span>
              <div className="flex gap-1 bg-white rounded-lg border border-stone-200 p-1">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTypeFilter(opt.value);
                      setPageInternal(1);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      typeFilter === opt.value
                        ? "bg-pine text-white shadow-sm"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Preset */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
                Хугацаа:
              </span>
              <select
                value={datePreset}
                onChange={(e) => {
                  setDatePreset(e.target.value);
                  setPageInternal(1);
                }}
                className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:border-pine cursor-pointer"
              >
                {DATE_PRESETS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
                Цэвэрлэх
              </button>
            )}
          </div>

          {/* Custom Date Range */}
          {datePreset === "custom" && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-500">
                  Эхлэх:
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    setPageInternal(1);
                  }}
                  className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-pine"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-500">
                  Дуусах:
                </label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    setPageInternal(1);
                  }}
                  className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-pine"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters indicator when filter bar is collapsed */}
      {!showFilters && hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Filter className="w-3 h-3" />
          <span>Шүүлтүүр идэвхтэй</span>
          <button
            onClick={handleClearFilters}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Цэвэрлэх
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center p-8 text-stone-400 text-xs space-y-2">
          <Clock className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-bold text-red-500">{error}</p>
          <button
            onClick={() => setPage(1)}
            className="text-bronze font-bold hover:underline cursor-pointer"
          >
            Дахин оролдох
          </button>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center p-8 text-stone-400 text-xs space-y-3">
          <Clock className="w-8 h-8 mx-auto text-stone-300" />
          {hasActiveFilters ? (
            <>
              <p className="font-bold text-stone-500">
                Сонгосон шүүлтүүрт тохирох үйлдэл байхгүй.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-bronze font-bold hover:underline cursor-pointer"
              >
                Шүүлтүүрийг цэвэрлэх
              </button>
            </>
          ) : debouncedSearch ? (
            <>
              <p className="font-bold">Мэдээлэл олдсонгүй.</p>
              <p className="text-stone-400">
                &ldquo;{debouncedSearch}&rdquo; хайлтаар тохирох үйлдэл байхгүй
                байна.
              </p>
            </>
          ) : (
            <p className="font-bold">Одоогоор үйлдэл бүртгэгдээгүй байна.</p>
          )}
        </div>
      ) : (
        <>
          <div className="relative border-l-2 border-bronze/20 pl-4 space-y-8 text-xs font-medium">
            {activities.map((act) => {
              const ts = formatTimestamp(act.timestamp);
              return (
                <div key={act.id} className="relative group/activity">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-bronze" />

                  <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-3 hover:border-bronze/40 transition">
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={act.user?.avatarUrl || null}
                        name={act.userName}
                        size={28}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-stone-800 text-sm leading-relaxed">
                          {act.description}
                        </p>
                        <p className="mt-1.5 text-xs text-stone-400 flex items-center gap-1.5">
                          <span
                            title={ts.full}
                            className="group-hover/activity:hidden"
                          >
                            {ts.relative || "Огноо тодорхойгүй"}
                          </span>
                          <span
                            title={ts.full}
                            className="hidden group-hover/activity:inline"
                          >
                            {ts.full || ts.relative || "Огноо тодорхойгүй"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
              <span>Нийт {total} үйлдэл</span>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
