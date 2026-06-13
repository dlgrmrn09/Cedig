"use client";

import React from "react";

export default function BackCover() {
  return (
    <div
      className="shastir-page select-none h-full bg-[#3B2519] border-r-4 border-[#251810]"
      data-density="hard"
    >
      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 relative overflow-hidden text-center shadow-lg border-2 border-bronze/25 rounded-r-md bg-cover bg-center bg-[#2F1F14]">
        <div className="absolute inset-0 bg-[#251810]/30 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/black-thread.png")`,
          }}
        />

        <div className="text-bronze/40 text-xs font-mono py-2">
          ᠪᠠᠲᠤ ᠪᠡᠬᠢ ᠪᠣᠯᠲᠤᠭᠠᠢ
        </div>

        <div className="my-auto flex flex-col items-center justify-center space-y-2">
          <span className="text-4xl text-bronze drop-shadow-lg opacity-40">
            ☯
          </span>
          <span className="text-[9px] uppercase tracking-widest font-black text-stone-400 font-sans block mt-2">
            Эр зориг өв залгамж
          </span>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-bronze/25 to-transparent mt-3" />
        </div>

        <div className="text-stone-400/50 text-[8px] tracking-wider uppercase font-black">
          Цахим Ураг Судар • Cedig Lineage System • 2026
        </div>
      </div>
    </div>
  );
}
