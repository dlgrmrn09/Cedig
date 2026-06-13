"use client";

import React from "react";
import { ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function ZoomControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  showFilters,
  onToggleFilters,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-40 bg-white/90 backdrop-blur border border-bronze/20 p-2 rounded-xl flex items-center gap-1 shadow-xl">
      <button
        id="zoom-in-btn"
        onClick={onZoomIn}
        className="p-2 text-ink hover:bg-vellum transition-colors rounded-lg controls-button"
        title="Томсгох"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        id="zoom-out-btn"
        onClick={onZoomOut}
        className="p-2 text-ink hover:bg-vellum transition-colors rounded-lg controls-button"
        title="Багасгах"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button
        id="reset-view-btn"
        onClick={onFitView}
        className="p-2 text-ink hover:bg-vellum transition-colors rounded-lg controls-button"
        title="Голлуулах (Fit view)"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-pine/10 mx-1" />
      <button
        id="toggle-filters-btn"
        onClick={onToggleFilters}
        className={`p-2 rounded-lg controls-button transition-colors ${showFilters ? "bg-bronze text-ink" : "text-ink hover:bg-vellum"}`}
        title="Хайлтын шүүлтүүр"
      >
        <Filter className="w-5 h-5" />
      </button>
    </div>
  );
}
