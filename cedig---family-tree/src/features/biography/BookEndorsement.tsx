"use client";

import React from "react";

export default function BookEndorsement() {
  return (
    <div
      className="shastir-page select-none h-full bg-[#FAF6EE]"
      data-density="soft"
    >
      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 relative overflow-hidden bg-[#FAF6EE] border-r border-[#EBE7DF] border-l">
        <div className="absolute top-4 left-6 text-[#735c00] text-[9px] font-black tracking-widest uppercase">
          ✦ УРГИЙН ГАРВАЛ БАТЛАХ
        </div>

        <div className="my-auto text-center space-y-4 px-4">
          <div className="w-16 h-16 border-2 border-red-800/25 rounded-full flex items-center justify-center text-red-800 font-extrabold text-lg mx-auto bg-rose-50/50">
            印
          </div>
          <h3 className="font-serif font-extrabold text-sm md:text-base text-[#2C1A10] tracking-wide">
            ЗАСАГ ТӨРИЙН УГ СУДАР
          </h3>
          <p className="text-[11.5px] text-stone-600 leading-relaxed max-w-sm mx-auto">
            Түүхэн бүртгэлт цуглууллага, бичиг баримтуудыг удирдах, гарал
            шилжилтийг баталгаажуулах тэмдэг бүхий цахим ураг судрыг
            албажуулав.
          </p>

          <div className="pt-3 font-serif italic text-xs text-stone-400">
            Хаадын овог эрдэнийн сангаас хүндэтгэв.
          </div>
        </div>

        <div className="text-[9px] font-black text-stone-400 text-center uppercase tracking-widest border-t border-[#735c00]/10 pt-2 shrink-0">
          Удмын • Хэлхээ ураг
        </div>
      </div>
    </div>
  );
}
