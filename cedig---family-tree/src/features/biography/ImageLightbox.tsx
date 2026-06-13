"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  image: { url: string; label: string; year: string } | null;
}

export default function ImageLightbox({ open, onClose, image }: ImageLightboxProps) {
  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-[#090705]/95 backdrop-blur-md">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[800px] bg-stone-100 p-4 rounded-xl shadow-2xl border-4 border-[#735c00] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-[#735c00] text-white p-2 rounded-full hover:scale-105 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full h-[50vh] bg-black rounded overflow-hidden">
          <Image
            src={image.url}
            alt={image.label}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-contain"
            unoptimized
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-full text-center mt-3">
          <p className="font-serif text-[#3B291D] font-black text-lg">{image.label}</p>
          <p className="text-xs text-stone-500 font-bold uppercase mt-0.5">{image.year} • Угийн Бичгийн Ил Албум</p>
        </div>
      </div>
    </div>
  );
}
