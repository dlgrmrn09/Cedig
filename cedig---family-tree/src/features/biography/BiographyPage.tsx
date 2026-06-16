"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Heart, UserCircle } from "lucide-react";
import type { Person } from "@/src/types/person";
import { PERSON_FIELDS } from "@/src/config/personFields";
import type { PersonFieldConfig } from "@/src/config/personFields";

interface BiographyPageProps {
  activePerson: Person;
  portraitUrl: string;
  animalYear: string;
  age: number;
  relationships: {
    father?: Person;
    mother?: Person;
    spouse?: Person;
    children: Person[];
  };
}

function displayValue(person: Person, field: PersonFieldConfig): string | null {
  const raw = person[field.key as keyof Person];
  if (raw === undefined || raw === null || raw === "") return null;
  if (Array.isArray(raw)) return raw.join(", ") || null;
  if (typeof raw === "object") return JSON.stringify(raw);
  if (typeof raw === "boolean") return raw ? "Тийм" : "Үгүй";
  return String(raw);
}

function PersonInfoField({ person, field }: { person: Person; field: PersonFieldConfig }) {
  const value = displayValue(person, field);
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <span className="text-stone-400 font-semibold text-[10px]">{field.label.toUpperCase()}</span>
      <p className="font-bold text-ink text-[11px]">{value}</p>
    </div>
  );
}

function PersonRelationships({
  activePerson,
  relationships,
}: {
  activePerson: Person;
  relationships: BiographyPageProps["relationships"];
}) {
  return (
    <div className="border-t border-stone-200 pt-3 space-y-2">
      <span className="text-[9px] tracking-widest font-black text-[#735c00] uppercase">Холбоо / Гэр бүл</span>
      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        {relationships.father ? (
          <button
            data-btn-action="open-person"
            data-btn-value={relationships.father.id}
            className="bg-white/60 rounded-lg p-2 border border-stone-200 hover:border-bronze/50 transition cursor-pointer text-left w-full"
          >
            <span className="text-[8px] text-stone-400 font-bold block">ЭЦЭГ</span>
            <p className="font-bold text-ink truncate"><User className="w-2.5 h-2.5 inline mr-0.5" />{relationships.father.firstName} {relationships.father.lastName}</p>
          </button>
        ) : (
          <button data-btn-action="add-relation-father" className="bg-white/60 rounded-lg p-2 border border-dashed border-stone-300 text-stone-400 font-bold hover:border-bronze hover:text-bronze transition flex items-center gap-1 justify-center cursor-pointer w-full">
            Эцэг +
          </button>
        )}
        {relationships.mother ? (
          <button
            data-btn-action="open-person"
            data-btn-value={relationships.mother.id}
            className="bg-white/60 rounded-lg p-2 border border-stone-200 hover:border-bronze/50 transition cursor-pointer text-left w-full"
          >
            <span className="text-[8px] text-stone-400 font-bold block">ЭХ</span>
            <p className="font-bold text-ink truncate"><User className="w-2.5 h-2.5 inline mr-0.5" />{relationships.mother.firstName} {relationships.mother.lastName}</p>
          </button>
        ) : (
          <button data-btn-action="add-relation-mother" className="bg-white/60 rounded-lg p-2 border border-dashed border-stone-300 text-stone-400 font-bold hover:border-bronze hover:text-bronze transition flex items-center gap-1 justify-center cursor-pointer w-full">
            Эх +
          </button>
        )}
      </div>
      <div className="space-y-1 text-[10px]">
        {relationships.spouse ? (
          <button
            data-btn-action="open-person"
            data-btn-value={relationships.spouse.id}
            className="w-full bg-white/60 rounded-lg p-2 border border-stone-200 hover:border-bronze/50 transition cursor-pointer text-left flex items-center gap-2"
          >
            <Heart className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="font-bold text-ink truncate"><User className="w-2.5 h-2.5 inline mr-0.5" />{relationships.spouse.firstName} {relationships.spouse.lastName}</span>
          </button>
        ) : activePerson.gender === "male" ? (
          <button data-btn-action="add-relation-spouse" className="w-full bg-white/60 rounded-lg p-2 border border-dashed border-stone-300 text-stone-400 font-bold hover:border-bronze hover:text-bronze transition flex items-center gap-1 justify-center cursor-pointer">
            Эхнэр +
          </button>
        ) : (
          <button data-btn-action="add-relation-spouse" className="w-full bg-white/60 rounded-lg p-2 border border-dashed border-stone-300 text-stone-400 font-bold hover:border-bronze hover:text-bronze transition flex items-center gap-1 justify-center cursor-pointer">
            Нөхөр +
          </button>
        )}
        {relationships.children.length > 0 && (
          <div className="bg-white/60 rounded-lg p-2 border border-stone-200">
            <span className="text-[8px] text-stone-400 font-bold block mb-1">ХҮҮХДҮҮД</span>
            {relationships.children.map((child) => (
              <button
                key={child.id}
                data-btn-action="open-person"
                data-btn-value={child.id}
                className="w-full text-left font-bold text-ink truncate py-0.5 hover:text-bronze transition cursor-pointer block"
              >
                <User className="w-2.5 h-2.5 inline mr-0.5" />{child.firstName} {child.lastName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const DISPLAY_FIELDS = PERSON_FIELDS.filter(
  (f) => f.key !== "biography" && f.key !== "notes" && f.key !== "firstName" && f.key !== "lastName"
);

function MemberPortrait({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error || !src || src.startsWith("data:image/svg")) {
    return (
      <div className="w-full h-full rounded-full bg-stone-200 flex items-center justify-center">
        <UserCircle className="w-8 h-8 md:w-12 md:h-12 text-stone-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="80px"
      unoptimized
      onError={() => setError(true)}
      className="object-cover rounded-full"
    />
  );
}

export default function BiographyPage({
  activePerson,
  portraitUrl,
  animalYear,
  age,
  relationships,
}: BiographyPageProps) {
  const displayFields = DISPLAY_FIELDS;

  return (
    <div className="shastir-page select-none h-full bg-[#FAF6EE]" data-density="soft">
      <div className="w-full h-full flex flex-col justify-between p-5 md:p-8 relative overflow-hidden bg-[#FAF6EE] border-r border-black/[0.05]">
        <div className="flex-1 flex flex-col space-y-4 justify-start overflow-y-auto">
          <div className="flex justify-between items-start shrink-0">
            <div className="text-left">
              <span className="text-[9px] tracking-widest font-black text-[#735c00] uppercase block">Ургийн Бичиг </span>
              <h3 className="text-lg md:text-2xl font-bold font-display text-ink mt-1 leading-tight">
                {activePerson.lastName} {activePerson.firstName}
              </h3>
              <span className="text-[11px] text-stone-500 block mt-1">
                {activePerson.birthYear} – {activePerson.deathDate || "одоо"} · {age} нас
              </span>
            </div>
            <div className="relative w-12 h-12 md:w-20 md:h-20 shrink-0 ml-2 rounded-full overflow-hidden border-2 border-bronze/40">
              <MemberPortrait src={portraitUrl} alt={`${activePerson.firstName} ${activePerson.lastName}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
            {displayFields.map((field) => (
              <PersonInfoField key={field.key} person={activePerson} field={field} />
            ))}
            <div className="space-y-0.5">
              <span className="text-stone-400 font-semibold text-[10px]">ЖИЛ</span>
              <p className="font-bold text-ink text-[11px]">{animalYear}</p>
            </div>
          </div>



          <PersonRelationships
            activePerson={activePerson}
            relationships={relationships}
          />
        </div>
      </div>
    </div>
  );
}
