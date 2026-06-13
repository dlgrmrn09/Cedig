"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/src/store";
import { X } from "lucide-react";
import { PersonSkeleton } from "@/src/components/SkeletonLoader";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.id as string;
  const person = useAppStore((s) => s.people.find((p) => p.id === personId));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!person) {
      const timer = setTimeout(() => setNotFound(true), 500);
      return () => clearTimeout(timer);
    }
  }, [person]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-ink">Хүн олдсонгүй</h1>
          <p className="text-stone-500">Энэ ID-тай хүн бүртгэлд байхгүй байна.</p>
          <button onClick={() => router.push("/family-tree")} className="bg-pine text-vellum px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 cursor-pointer">
            Ургийн мод руу буцах
          </button>
        </div>
      </div>
    );
  }

  if (!person) {
    return <PersonSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col">
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-6 shrink-0">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-bold ml-3">{person.firstName} {person.lastName}</h1>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-bronze/10 flex items-center justify-center text-2xl font-bold text-bronze">
                {person.firstName[0]}{person.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{person.firstName} {person.lastName}</h2>
                <p className="text-sm text-stone-500">{person.clanName || "Clan not specified"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-stone-400">Төрсөн он:</span> <span className="font-medium">{person.birthYear}</span></div>
              <div><span className="text-stone-400">Хүйс:</span> <span className="font-medium">{person.gender === "male" ? "Эр" : "Эм"}</span></div>
              {person.deathDate && <div><span className="text-stone-400">Нас барсан:</span> <span className="font-medium">{person.deathDate}</span></div>}
              <div><span className="text-stone-400">Холбоо:</span> <span className="font-medium">{person.relationshipLabel}</span></div>
            </div>
            {person.biography && (
              <div>
                <h3 className="font-bold text-sm text-stone-500 mb-2">НАМТАР</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{person.biography}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
