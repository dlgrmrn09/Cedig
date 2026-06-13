"use client";

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { ScrapbookPic } from "@/src/types/media";

interface ScrapbookPageProps {
  scrapbookPics: ScrapbookPic[];
  onUploadPhoto: () => void;
  onSetLightbox: (pic: ScrapbookPic) => void;
  onDeleteImage: (id: string) => void;
}

export default function ScrapbookPage({
  scrapbookPics,
  onUploadPhoto,
}: ScrapbookPageProps) {
  return (
    <div className="shastir-page select-none h-full bg-[#FAF6EE]" data-density="soft">
      <div className="w-full h-full flex flex-col justify-between p-5 md:p-8 relative overflow-hidden bg-[#FAF6EE] border-r border-black/[0.05]">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-bronze rounded-full" />
            <span className="text-[10px] tracking-widest font-black text-[#735c00] uppercase">Зургийн цомог</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {scrapbookPics.slice(0, 4).map((pic, idx) => (
              <div
                key={pic.id || idx}
                data-btn-action="set-lightbox"
                data-btn-value={pic.id || pic.url}
                className="bg-white p-1.5 border border-stone-200 rounded-lg group relative cursor-zoom-in"
              >
                <div className="relative h-20 w-full rounded overflow-hidden">
                  <Image src={pic.url} alt={pic.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="text-[9px] text-ink/70 font-bold mt-1 truncate">{pic.label}</p>
                <span className="text-[8px] text-stone-400">{pic.year}</span>
                {pic.isDynamic && pic.id && (
                  <button
                    data-btn-action="delete-image"
                    data-btn-value={pic.id || ""}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            data-btn-action="upload-photo"
            onClick={onUploadPhoto}
            className="w-full py-2 border-2 border-dashed border-stone-300 rounded-xl text-[10px] font-bold text-stone-400 hover:border-bronze hover:text-bronze transition-all cursor-pointer"
          >
            + Зураг нэмэх
          </button>
        </div>
      </div>
    </div>
  );
}
