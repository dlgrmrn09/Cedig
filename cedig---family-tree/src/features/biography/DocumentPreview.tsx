"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface DocumentPreviewProps {
  open: boolean;
  onClose: () => void;
  doc: { title: string; url: string } | null;
}

export default function DocumentPreview({ open, onClose, doc }: DocumentPreviewProps) {
  if (!open || !doc) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[850px] bg-[#FAF6EE] p-5 rounded-2xl shadow-2xl border-4 border-[#32231A]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#32231A] text-white p-2 rounded-full cursor-pointer hover:scale-105 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif italic font-bold text-lg text-[#32231A] border-b border-[#735c00]/20 pb-2 mb-4">
          📂 Баримтын хуудас: {doc.title}
        </h3>

        <div className="relative bg-[#FAF6EE] h-[55vh] border border-[#735c00]/20 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 select-none shadow-inner">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")` }}
          />

          <div className="relative w-full h-full">
            <Image
              src={doc.url}
              alt={doc.title}
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-contain grayscale-[40%] bg-stone-50 p-2 border border-stone-200"
              unoptimized
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full border-4 border-[#ba1a1a]/40 flex items-center justify-center text-[#ba1a1a]/40 font-black rotate-12 select-none pointer-events-none text-xs">
            БАТАЛГААТУУЛАВ
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-xs">
          <span className="text-stone-500 font-bold uppercase tracking-wider">Цахим Угийн Бичиг Сүлжээ • Албан Баримт</span>
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="bg-[#3B291D] hover:bg-black text-white p-2 px-4 rounded font-bold cursor-pointer"
          >
            🖥 Шинэ таб-д нээх
          </a>
        </div>
      </div>
    </div>
  );
}
