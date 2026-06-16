"use client";

import React from "react";

interface BookCoverProps {
  activePerson: {
    firstName: string;
    lastName: string;
    clanName: string;
    birthYear: number;
  };
}

export default function BookCover({ activePerson }: BookCoverProps) {
  return (
    <div
      className="shastir-page select-none h-full bg-[#3B2519] border-l-4 border-[#251810]"
      data-density="hard"
    >
      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 relative overflow-hidden text-center shadow-lg border-2 border-bronze/25 rounded-l-md bg-cover bg-center bg-[#2F1F14]">
        <div className="absolute inset-0 bg-[#251810]/30 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/black-thread.png")`,
          }}
        />

        <div className="text-bronze text-xl font-bold font-mono tracking-widest pt-2">
          ᠤᠪᠤᠭ ᠱᠠᠰᠲᠢᠷ
        </div>

        <div className="my-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-28 h-28 rounded-full border-4 border-double border-bronze/75 flex items-center justify-center text-bronze font-extrabold text-3xl shadow-lg bg-[#251A11]">
            ✦
          </div>
          <div className="space-y-2 mt-4">
            <span className="text-stone-400 text-xs uppercase font-black tracking-widest block font-sans">
              Түүхт ургийн бичиг
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-bronze uppercase tracking-wide leading-none pb-1">
              УГ СУДАР
            </h1>
            <p className="text-stone-300 text-base font-serif italic mt-1 leading-tight tracking-[0.1em]">
              {activePerson.clanName || ""} ОВОГТ
            </p>
            <p className="text-bronze/90 text-lg font-serif tracking-widest mt-2 block font-semibold">
              {activePerson.firstName} • СУДАР
            </p>
          </div>
        </div>

        <div className="text-bronze text-[10px] tracking-widest uppercase font-black border-t border-bronze/30 pt-3 relative">
          <span className="absolute -top-[7px] left-1/2 -ml-3 bg-[#2F1F14] px-2 text-xs">
            印
          </span>
          Цэдиг
        </div>
      </div>
    </div>
  );
}
