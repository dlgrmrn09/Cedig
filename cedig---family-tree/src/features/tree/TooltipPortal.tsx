"use client";

import { createPortal } from "react-dom";
import type { Person } from "@/src/types/person";

interface TooltipPortalProps {
  person: Person | null;
  rect: { x: number; y: number } | null;
}

export default function TooltipPortal({ person, rect }: TooltipPortalProps) {
  if (typeof window === "undefined" || !document.body || !person || !rect)
    return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: rect.x,
        top: rect.y,
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
      className="w-48 bg-pine text-vellum dark:bg-[#0B1A2A] rounded-xl p-3.5 shadow-2xl border border-bronze/30 text-left text-xs space-y-2 pointer-events-none transition-all duration-150"
    >
      <p className="font-bold border-b border-vellum/15 pb-1">
        {person.firstName} {person.lastName}
      </p>
      <div>
        <span className="text-gray-400 block text-[9px]">
          Төрсөн газар:
        </span>
        <span>{person.birthPlace}</span>
      </div>
      {person.deathDate && (
        <div>
          <span className="text-gray-400 block text-[9px]">
            Төрсөн огноо:
          </span>
          <span className="truncate block">
            {person.birthDate?.split("-")[0]} -{" "}
            {person.deathDate?.split("-")[0]}
          </span>
        </div>
      )}
    </div>,
    document.body,
  );
}
