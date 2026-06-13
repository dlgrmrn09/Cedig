"use client";

import React, { useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface TreeSearchSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSubmit: (e: React.FormEvent | React.KeyboardEvent) => void;
  searchResultCount?: number;
  activeSearchIndex?: number;
  onNextResult?: () => void;
  onPrevResult?: () => void;
}

export default function TreeSearchSidebar({
  isCollapsed,
  onToggle,
  searchQuery,
  onSearchChange,
  onSubmit,
  searchResultCount = 0,
  activeSearchIndex = 0,
  onNextResult,
  onPrevResult,
}: TreeSearchSidebarProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit(e);
      }
    },
    [onSubmit],
  );

  const hasResults = searchResultCount > 0;

  return (
    <div
      className={`${isCollapsed ? "w-14 px-2 py-6 bg-transparent" : "w-72 p-6 border-r bg-white/70 "}  border-bronze/20 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0 z-30 relative mr-0.5 transition-all duration-300`}
    >
      {isCollapsed ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={onToggle}
              className="p-2 border border-bronze/20 bg-vellum/55 hover:bg-bronze hover:text-ink text-ink rounded-xl transition cursor-pointer shadow-md flex items-center justify-center"
              title="Шүүлтүүр нээх (Expand)"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-bronze">
                  Cedig
                </span>
                <h2 className="text-xl font-display font-bold text-ink mt-1">
                  Овог ба холбоос
                </h2>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 rounded-lg border border-bronze/25 bg-vellum/30 hover:bg-bronze hover:text-ink text-ink transition cursor-pointer"
                title="Хайлт хумих (Collapse)"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Lineage Search Container */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider block">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Бат-Эрдэнэ..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-vellum border border-ink/15 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-bronze"
                />
                <Search className="w-3.5 h-3.5 text-ink/40 absolute left-3 top-3" />
              </div>
            </div>

            {/* Search result navigator */}
            {searchQuery && (
              <div className="flex items-center justify-between bg-bronze/5 border border-bronze/20 rounded-xl px-3 py-2">
                <button
                  onClick={onPrevResult}
                  disabled={!hasResults}
                  className="p-1 rounded-lg hover:bg-bronze/20 text-ink/60 hover:text-bronze disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Previous result (Shift+Enter)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-ink/70 select-none">
                  {hasResults
                    ? `${activeSearchIndex + 1} / ${searchResultCount}`
                    : "0 олдсон"}
                </span>

                <button
                  onClick={onNextResult}
                  disabled={!hasResults}
                  className="p-1 rounded-lg hover:bg-bronze/20 text-ink/60 hover:text-bronze disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Next result (Enter)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hint text */}
            {searchQuery && !hasResults && (
              <p className="text-[10px] text-stone-400 italic">
                Хайлтанд тохирох гишүүн олдсонгүй
              </p>
            )}
            {searchQuery && hasResults && (
              <p className="text-[10px] text-stone-500 italic">
                Enter = дараагийн үр дүн · Shift+Enter = өмнөх үр дүн
              </p>
            )}
            {!searchQuery && (
              <p className="text-[10px] text-ink/50 italic">
                Гишүүний нэрийг бичээд Enter дарж байршлыг тогтооно.
              </p>
            )}
          </div>

          {/* Traditional ornament decorative card */}
          <div className="p-4 border border-ink/10 bg-stone-50 text-[11px] text-ink/50 text-center rounded-xl font-medium tracking-tight mt-auto">
            CEDIG Ургийн бичиг сүлжээ
          </div>
        </>
      )}
    </div>
  );
}
