"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { FilterState } from "@/src/types/common";

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  onApply: () => void;
  onReset: () => void;
  clanOptions: string[];
}

export default function FilterPanel({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
  clanOptions: _clanOptions,
}: FilterPanelProps) {
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(
    () => filters.yearRange,
  );

  if (filters.yearRange[0] !== localYearRange[0] || filters.yearRange[1] !== localYearRange[1]) {
    setLocalYearRange(filters.yearRange);
  }

  if (!open) return null;

  const content = (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-bronze" />
            <h3 className="text-base font-display font-bold text-ink">
              Шүүлтүүр
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-ink/40 hover:text-ink"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        {/* Birth Year range slide inputs */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-ink/60 uppercase tracking-wider">
              Төрсөн оны зааг
            </label>
            <span className="font-mono text-bronze font-bold text-[11px]">
              {localYearRange[0]} - {localYearRange[1]}
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="1900"
              max="2026"
              value={localYearRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLocalYearRange([val, localYearRange[1]]);
              }}
              className="w-full accent-bronze"
            />
            <input
              type="range"
              min="1900"
              max="2026"
              value={localYearRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLocalYearRange([localYearRange[0], val]);
              }}
              className="w-full accent-bronze"
            />
          </div>
        </div>

      </div>

      <div className="space-y-2 pt-6 border-t border-ink/10">
        <button
          onClick={() => {
            setFilters({ yearRange: localYearRange });
            onApply();
          }}
          className="w-full bg-pine text-vellum py-3 rounded-xl font-bold text-xs cursor-pointer hover:opacity-90"
        >
          Apply
        </button>
        <button
          onClick={() => {
            onReset();
          }}
          className="w-full border-2 border-ink/15 text-ink/60 py-2.5 rounded-xl font-bold text-xs hover:bg-pine/5 cursor-pointer"
        >
           Clear
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30 md:hidden"
        onClick={onClose}
      >
        <div
          className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-80 border-l border-bronze/20 bg-white/80 backdrop-blur-md p-6 flex-col justify-between shrink-0 z-30 shadow-2xl relative">
        {content}
      </div>
    </>
  );
}
