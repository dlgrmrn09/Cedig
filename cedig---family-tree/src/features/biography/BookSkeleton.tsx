"use client";

import React from "react";

interface BookSkeletonProps {
  className?: string;
}

export default function BookSkeleton({ className = "" }: BookSkeletonProps) {
  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 md:p-6 lg:p-8 select-none animate-pulse ${className}`}
      aria-busy="true"
    >
      <div className="relative z-10 w-full max-w-[1240px] h-full md:h-[780px] lg:h-[820px] max-h-[90vh] flex flex-col md:flex-row rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden border-[10px] border-[#251A13] bg-[#2E2017]">
        <div className="flex-1 flex flex-col bg-[#FAF6EE] relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6EE] z-20 rounded-xl m-4">
            <div className="w-14 h-14 rounded-full border-4 border-double border-[#735c00]/40 flex items-center justify-center text-[#735c00] animate-spin text-lg mb-3">
              ✦
            </div>
            <span className="text-[10px] font-black uppercase text-[#735c00]/80 tracking-widest font-sans">
              Цахим судар уншиж байна...
            </span>
          </div>
          <div className="flex-1 flex gap-0 opacity-10">
            <div className="flex-1 bg-stone-200 rounded-l-md p-6 space-y-4">
              <div className="h-4 bg-stone-300 rounded w-1/3" />
              <div className="h-24 bg-stone-300 rounded w-full" />
              <div className="space-y-2">
                <div className="h-3 bg-stone-300 rounded w-full" />
                <div className="h-3 bg-stone-300 rounded w-4/5" />
              </div>
            </div>
            <div className="flex-1 bg-stone-200 rounded-r-md p-6 space-y-4">
              <div className="h-4 bg-stone-300 rounded w-1/3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-20 bg-stone-300 rounded" />
                <div className="h-20 bg-stone-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
