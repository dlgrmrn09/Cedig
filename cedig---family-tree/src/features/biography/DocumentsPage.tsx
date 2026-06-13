"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import type { DocumentItem } from "@/src/types/media";

interface DocumentsPageProps {
  documents: DocumentItem[];
  onUploadDocument: () => void;
  onPreviewDoc: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
}

export default function DocumentsPage({
  documents,
  onUploadDocument,
}: DocumentsPageProps) {
  return (
    <div className="shastir-page select-none h-full bg-[#FAF6EE]" data-density="soft">
      <div className="w-full h-full flex flex-col justify-between p-5 md:p-8 relative overflow-hidden bg-[#FAF6EE] border-l border-black/[0.05]">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-bronze rounded-full" />
            <span className="text-[10px] tracking-widest font-black text-[#735c00] uppercase">Баримтын архив</span>
          </div>

          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="p-2 py-2.5 bg-white/70 border border-[#735c00]/15 rounded-lg hover:border-bronze/35 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-bronze/10 text-bronze shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-ink truncate">{doc.title}</p>
                  <p className="text-[9px] text-stone-500 truncate">{doc.desc}</p>
                  <span className="text-[8px] text-stone-400">{doc.fileType} · {doc.size}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    data-btn-action="preview-doc"
                    data-btn-value={doc.id}
                    className="text-[9px] px-2 py-1 rounded-lg bg-bronze/15 text-ink font-bold hover:bg-bronze/25 transition-colors cursor-pointer"
                  >
                    Харах
                  </button>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-ink/50 hover:text-bronze transition-colors">
                    <Download className="w-3 h-3" />
                  </a>
                  {doc.isDynamic && (
                    <button
                      data-btn-action="delete-doc"
                      data-btn-value={doc.id}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            data-btn-action="upload-document"
            onClick={onUploadDocument}
            className="w-full py-2 border-2 border-dashed border-stone-300 rounded-xl text-[10px] font-bold text-stone-400 hover:border-bronze hover:text-bronze transition-all cursor-pointer"
          >
            + Баримт нэмэх
          </button>
        </div>
      </div>
    </div>
  );
}
