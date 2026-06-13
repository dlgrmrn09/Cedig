"use client";

import React from "react";
import { Award } from "lucide-react";

interface NarrativePageProps {
  activePerson: {
    biography?: string;
    firstName: string;
    birthYear: number;
    birthPlace?: string;
    occupation?: string;
  };
}

export default function NarrativePage({ activePerson }: NarrativePageProps) {
  return (
    <div
      className="shastir-page select-none h-full bg-[#FAF6EE]"
      data-density="soft"
    >
      <div className="w-full h-full flex flex-col justify-between p-5 md:p-8 relative overflow-hidden bg-[#FAF6EE] border-l border-black/[0.05]">
        <div className="flex-1 flex flex-col space-y-4 justify-start">
          <div className="flex items-center justify-between border-b border-[#735c00]/15 pb-1.5 text-left">
            <h4 className="font-serif italic font-bold text-xs md:text-sm text-[#281c12] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#735c00]" /> Намтар
            </h4>
            <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wide">
              Он цагийн товчоон
            </span>
          </div>

          <div className="text-stone-850 text-[11.5px] md:text-xs leading-relaxed text-justify font-sans space-y-3 font-medium text-left max-h-[220px] overflow-y-auto custom-scroll pr-1">
            {activePerson.biography ? (
              <div className="whitespace-pre-wrap">
                <span className="float-left text-3xl font-serif text-[#735c00] mr-1.5 font-extrabold leading-none pt-0.5 select-none">
                  {activePerson.biography.charAt(0)}
                </span>
                {activePerson.biography.slice(1)}
              </div>
            ) : (
              <p className="italic text-stone-400">
                Удам судар, залуу нас, амьдрал ололтын талаарх тэмдэглэл
                харах бичигдээгүй байна. Засах горимоор засаж судар
                баяжуулаарай.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-[#735c00]/10 space-y-2.5 flex-1 text-left">
            <h5 className="text-[8.5px] text-[#735c00] uppercase tracking-widest font-black block">
               Он цагийн товчоон
            </h5>

            <div className="space-y-2">
              <div className="flex gap-2 items-start text-[10.5px] text-left">
                <span className="font-mono font-bold text-[#735c00] shrink-0 bg-amber-50 px-1 py-[1px] rounded border border-[#735c00]/10">
                  {activePerson.birthYear} он
                </span>
                <div className="text-stone-700 leading-tight">
                  <strong>Мэндэлсэн:</strong>{" "}
                  {activePerson.birthPlace ||
                    "Монгол Улсын Тамир голын тал нуур хороонд"}{" "}
                  Аймагт айлын дунд хүү болон мэдэлжээ .
                </div>
              </div>

              <div className="flex gap-2 items-start text-[10.5px] text-left">
                <span className="font-mono font-bold text-[#735c00] shrink-0 bg-amber-50 px-1 py-[1px] rounded border border-[#735c00]/10">
                  Ажил
                </span>
                <div className="text-stone-700 leading-tight">
                  <strong>Мэргэжил:</strong> Насан туршид &ldquo;
                  {activePerson.occupation || "Төрийн алба хаагч"}&rdquo;
                  -аар насаараа ажилжээ.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[8.5px] uppercase font-black text-stone-400 tracking-wider flex justify-between items-center pt-2 border-t border-[#735c00]/10 mt-auto shrink-0">
          <span>CEDIG ARCHIVE • COGNITO</span>
        </div>
      </div>
    </div>
  );
}
