"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Book,
  BookOpen,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { Person } from "@/src/types/person";
import type { ScrapbookPic, DocumentItem } from "@/src/types/media";
import BookCover from "./BookCover";
import BookPreface from "./BookPreface";
import BiographyPage from "./BiographyPage";
import NarrativePage from "./NarrativePage";
import ScrapbookPage from "./ScrapbookPage";
import DocumentsPage from "./DocumentsPage";
import BookEndorsement from "./BookEndorsement";
import BackCover from "./BackCover";

interface ShastirBookProps {
  activePerson: Person;
  scrapbookPics: ScrapbookPic[];
  documentsArchive: DocumentItem[];
  relationships: {
    father?: Person;
    mother?: Person;
    spouse?: Person;
    children: Person[];
  };
  setAddingRelation: (
    personId: string,
    role: "father" | "mother" | "spouse" | "child",
  ) => void;
  deleteMediaItem: (id: string) => void;
  canDelete: boolean;
  addNotification: (
    type: "info" | "success" | "warn",
    title: string,
    message: string,
  ) => void;
  setActiveUploadType: (type: "photo" | "document" | null) => void;
  setDocPreview: (preview: { title: string; url: string } | null) => void;
  setLightboxImage: (
    image: { url: string; label: string; year: string } | null,
  ) => void;
  setActivePersonId: (id: string | null) => void;
  age: number;
  animalYear: string;
  portraitUrl: string;
}

export default function ShastirBook({
  activePerson,
  scrapbookPics,
  documentsArchive,
  relationships,
  setAddingRelation,
  deleteMediaItem,
  canDelete,
  addNotification,
  setActiveUploadType,
  setDocPreview,
  setLightboxImage,
  setActivePersonId,
  age,
  animalYear,
  portraitUrl,
}: ShastirBookProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const [isLanscape, setIsLandscape] = useState(true);
  const [bookSize, setBookSize] = useState({ width: 1160, height: 740 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!parentRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: pWidth, height: pHeight } = entries[0].contentRect;

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const isPortraitMode = pWidth < 900 || pWidth / pHeight < 1.1;
        const targetRatio = isPortraitMode ? 580 / 740 : 1160 / 740;

        const maxBookW = Math.max(280, pWidth - (isPortraitMode ? 24 : 48));
        const maxBookH = Math.max(360, pHeight - 40);

        let finalW = maxBookW;
        let finalH = finalW / targetRatio;

        if (finalH > maxBookH) {
          finalH = maxBookH;
          finalW = finalH * targetRatio;
        }

        finalW = Math.round(finalW);
        finalH = Math.round(finalH);

        setBookSize({ width: finalW, height: finalH });
      }, 150);
    });

    const currentParentRef = parentRef.current;
    resizeObserver.observe(currentParentRef);

    return () => {
      clearTimeout(timeoutId);
      if (currentParentRef) {
        resizeObserver.unobserve(currentParentRef);
      }
    };
  }, []);

  const rebuildKey = `${activePerson.id}_${activePerson.firstName}_${activePerson.lastName}_${activePerson.biography?.length || 0}_${scrapbookPics.length}_${documentsArchive.length}_${bookSize.width}_${bookSize.height}`;

  useEffect(() => {
    let flipInstance: any = null;
    let isCancelled = false;

    const initBook = async () => {
      setIsReady(false);
      if (!containerRef.current) return;

      containerRef.current.innerHTML = "";

      const flipBookEl = document.createElement("div");
      flipBookEl.className = "flip-book";
      flipBookEl.style.width = "100%";
      flipBookEl.style.height = "100%";
      containerRef.current.appendChild(flipBookEl);

      try {
        const { PageFlip } = await import("page-flip");
        if (isCancelled) return;

        const rawPagesContainer = document.getElementById(
          "shastir-book-raw-pages",
        );
        if (!rawPagesContainer) return;

        const pages = Array.from(
          rawPagesContainer.querySelectorAll(".shastir-page"),
        );
        if (pages.length === 0) {
          console.warn("No pages found to clone and initialize page-flip");
          return;
        }

        pages.forEach((page) => {
          const clone = page.cloneNode(true) as HTMLElement;
          flipBookEl.appendChild(clone);
        });

        const isPortraitMode = bookSize.width < bookSize.height;
        const pageW = isPortraitMode
          ? bookSize.width
          : Math.round(bookSize.width / 2);
        const pageH = bookSize.height;

        flipInstance = new PageFlip(flipBookEl, {
          width: pageW,
          height: pageH,
          size: "stretch",
          minWidth: 150,
          maxWidth: 1200,
          minHeight: 200,
          maxHeight: 1500,
          drawShadow: true,
          flippingTime: 800,
          usePortrait: isPortraitMode,
          startPage: currentPageRef.current,
          useMouseEvents: true,
          showCover: true,
          showPageCorners: true,
          maxShadowOpacity: 0.65,
          mobileScrollSupport: true,
        });

        flipInstance.loadFromHTML(flipBookEl.querySelectorAll(".shastir-page"));

        if (isCancelled) {
          flipInstance.destroy();
          return;
        }

        pageFlipRef.current = flipInstance;

        flipInstance.on("flip", (e: { data: number }) => {
          setCurrentPage(e.data);
        });

        flipInstance.on(
          "changeOrientation",
          (e: { data: "portrait" | "landscape" }) => {
            setIsLandscape(e.data === "landscape");
          },
        );

        setIsLandscape(flipInstance.getOrientation() === "landscape");

        setTimeout(() => {
          if (!isCancelled) {
            setIsReady(true);
          }
        }, 120);
      } catch (err) {
        console.error("Error loading page-flip library:", err);
      }
    };

    initBook();

    return () => {
      isCancelled = true;
      if (flipInstance) {
        try {
          flipInstance.destroy();
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildKey]);

  const goToPage = (pageIdx: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.turnToPage(pageIdx);
    }
  };

  const nextPage = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  };

  const prevPage = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  };

  const handleBookElementClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("[data-btn-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-btn-action");
    const value = btn.getAttribute("data-btn-value");

    if (action === "go-to-page") {
      goToPage(parseInt(value || "0", 10));
    } else if (action === "open-person") {
      if (value) setActivePersonId(value);
    } else if (action === "add-relation-father") {
      setAddingRelation(activePerson.id, "father");
    } else if (action === "add-relation-mother") {
      setAddingRelation(activePerson.id, "mother");
    } else if (action === "add-relation-spouse") {
      setAddingRelation(activePerson.id, "spouse");
    } else if (action === "set-lightbox") {
      const pic = scrapbookPics.find((p) => p.id === value || p.url === value);
      if (pic) setLightboxImage(pic);
    } else if (action === "delete-image") {
      e.stopPropagation();
      if (!canDelete) return;
      deleteMediaItem(value || "");
      addNotification("info", "Зургийн сан", "Зургийг амжилттай устгалаа.");
    } else if (action === "upload-photo") {
      setActiveUploadType("photo");
    } else if (action === "preview-doc") {
      const doc = documentsArchive.find((d) => d.id === value);
      if (doc) setDocPreview({ title: doc.title, url: doc.url });
    } else if (action === "upload-document") {
      setActiveUploadType("document");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF6EE] relative p-1 md:p-4 overflow-hidden select-none w-full h-full justify-between">
      <div className="absolute left-0 top-36 -ml-[48px] z-20 flex flex-col gap-3">
        <button
          onClick={() => goToPage(0)}
          className={`w-12 h-14 rounded-l-xl flex flex-col items-center justify-center shadow-md font-bold text-xs border border-r-0 border-[#2E2017]/30 transition-all ${
            currentPage === 0 || currentPage === 1
              ? "bg-[#EAD8B1] text-[#4A2E1B] translate-x-1.5 border-[#735c00]/30"
              : "bg-[#e2dac7]/80 text-[#3B291D] hover:bg-[#FAF6EE]"
          }`}
          title="Сурвалж Хавтас"
        >
          <Book className="w-4 h-4" />
          <span className="text-[8px] scale-90 block mt-0.5 font-sans">
            Хавтас
          </span>
        </button>

        <button
          onClick={() => goToPage(2)}
          className={`w-12 h-14 rounded-l-xl flex flex-col items-center justify-center shadow-md font-bold text-xs border border-r-0 border-[#2E2017]/30 transition-all ${
            currentPage === 2 || currentPage === 3
              ? "bg-[#EAD8B1] text-[#4A2E1B] translate-x-1.5 border-[#735c00]/30"
              : "bg-[#e2dac7]/80 text-[#3B291D] hover:bg-[#FAF6EE]"
          }`}
          title="Намтар судар"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[8px] scale-90 block mt-0.5 font-sans">
            Намтар
          </span>
        </button>

        <button
          onClick={() => goToPage(4)}
          className={`w-12 h-14 rounded-l-xl flex flex-col items-center justify-center shadow-md font-bold text-xs border border-r-0 border-[#2E2017]/30 transition-all ${
            currentPage === 4 || currentPage === 5
              ? "bg-[#EAD8B1] text-[#4A2E1B] translate-x-1.5 border-[#735c00]/30"
              : "bg-[#e2dac7]/80 text-[#3B291D] hover:bg-[#FAF6EE]"
          }`}
          title="Баримт бичиг"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[8px] scale-90 block mt-0.5 font-sans">
            Архив
          </span>
        </button>
      </div>

      <div
        ref={parentRef}
        className="flex-1 flex items-center justify-center w-full py-4 relative min-h-[400px]"
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")`,
          }}
        />

        <div className="absolute inset-x-8 top-12 bottom-12 bg-[#21140A]/60 rounded-lg blur-md shadow-2xl pointer-events-none -z-10" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .flip-book {
            margin: 0 auto;
            position: relative;
            box-sizing: border-box;
          }
          
          .shastir-page {
            box-sizing: border-box !important;
            margin: 0 !important;
          }

          .shastir-page:not(.stf__item) {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            visibility: hidden;
          }

          .shastir-page.stf__item {
            visibility: visible;
          }

          .shastir-page * {
            box-sizing: border-box;
          }
          
          .spine-refraction {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 14px;
            transform: translateX(-50%);
            background: linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.2) 100%);
            pointer-events: none;
            z-index: 28;
          }
        `,
          }}
        />

        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6EE] z-20 transition-opacity duration-300 rounded-xl m-4">
            <div className="w-14 h-14 rounded-full border-4 border-double border-[#735c00]/40 flex items-center justify-center text-[#735c00] animate-spin text-lg mb-3">
              ✦
            </div>
            <span className="text-[10px] font-black uppercase text-[#735c00]/80 tracking-widest font-sans">
              Цахим судар уншиж байна...
            </span>
          </div>
        )}

        <div
          ref={containerRef}
          key={rebuildKey}
          onClick={handleBookElementClick}
          className={`flip-book-wrapper shadow-inner relative z-10 transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
          style={{
            width: `${bookSize.width}px`,
            height: `${bookSize.height}px`,
          }}
        >
          {isLanscape && <div className="spine-refraction" />}
        </div>
      </div>

      <div className="h-10 border-t border-black/[0.04] bg-white/20 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 z-20 shrink-0 select-none">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`flex items-center gap-1 text-[10.5px] font-black uppercase transition-all ${
            currentPage === 0
              ? "opacity-20 cursor-not-allowed text-stone-400"
              : "text-[#735c00] hover:scale-95 cursor-pointer"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Өмнөх 
        </button>

        <div className="flex gap-2 items-center">
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentPage === 0 || currentPage === 1 ? "bg-[#735c00]" : "bg-stone-300"}`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentPage === 2 || currentPage === 3 ? "bg-[#735c00]" : "bg-stone-300"}`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentPage === 4 || currentPage === 5 ? "bg-[#735c00]" : "bg-stone-300"}`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentPage === 6 || currentPage === 7 ? "bg-[#735c00]" : "bg-stone-300"}`}
          />

          <span className="text-[9.5px] font-black text-[#735c00]/80 uppercase ml-1 block">
            {isLanscape
              ? `Хуудас ${currentPage} - ${currentPage + 1}`
              : `Хуудас ${currentPage}`}
          </span>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage >= 6}
          className={`flex items-center gap-1 text-[10.5px] font-black uppercase transition-all ${
            currentPage >= 6
              ? "opacity-20 cursor-not-allowed text-stone-400"
              : "text-[#735c00] hover:scale-95 cursor-pointer"
          }`}
        >
          Дараах  <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        id="shastir-book-raw-pages"
        className="hidden"
        style={{ display: "none" }}
      >
        <BookCover activePerson={activePerson} />

        <BookPreface />

        <BiographyPage
          activePerson={activePerson}
          portraitUrl={portraitUrl}
          animalYear={animalYear}
          age={age}
          relationships={relationships}
        />

        <NarrativePage activePerson={activePerson} />

        <ScrapbookPage
          scrapbookPics={scrapbookPics}
          onUploadPhoto={() => setActiveUploadType("photo")}
          onSetLightbox={(pic) => setLightboxImage(pic)}
          onDeleteImage={(id) => {
            deleteMediaItem(id);
            addNotification("info", "Зургийн сан", "Зургийг амжилттай устгалаа.");
          }}
          canDelete={canDelete}
        />

        <DocumentsPage
          documents={documentsArchive}
          onUploadDocument={() => setActiveUploadType("document")}
          onPreviewDoc={(doc) => setDocPreview({ title: doc.title, url: doc.url })}
          onDeleteDocument={() => {}}
        />

        <BookEndorsement />

        <BackCover />
      </div>
    </div>
  );
}
