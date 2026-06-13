"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { User, Search } from "lucide-react";
import type { PersonNodeData } from "./types";

export default function PersonNode({ data }: { data: PersonNodeData }) {
  const p = data.person;
  const isSearchMatch = data.isSearchMatch;
  const isActiveSearch = data.isActiveSearch;
  const isActive = data.isActive;

  const maleColor = "from-ink/5 to-ink/10 border-ink/20 text-ink/60";
  const femaleColor =
    "from-amber-600/5 to-amber-700/10 border-amber-700/20 text-amber-700/60";

  const genderAvatarStyle = p.gender === "male" ? maleColor : femaleColor;

  return (
    <div className="relative group p-1 select-none">
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0 w-2 h-2"
        id="top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 w-2 h-2"
        id="bottom"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0 w-2 h-2"
        id="right"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-2 h-2"
        id="left"
      />

      <div
        onClick={(e) => {
          e.stopPropagation();
          data.setActivePersonId(p.id);
        }}
        onMouseEnter={(e) => data.onHoverEnter(e, p)}
        onMouseLeave={() => data.onHoverLeave()}
        className={`w-[115px] h-[115px] rounded-full border-2 text-center cursor-pointer relative flex flex-col justify-center items-center p-2 transition-all duration-200 ease-out ${
          isActiveSearch
            ? "border-bronze bg-vellum shadow-[0_0_20px_8px_rgba(196,149,106,0.35)] ring-4 ring-bronze/50 scale-105"
            : isSearchMatch
              ? "border-bronze bg-white shadow-lg ring-2 ring-bronze/30"
              : isActive
                ? "border-bronze bg-vellum shadow-md"
                : "border-ink/15 bg-white shadow-md hover:shadow-lg"
        } hover:border-bronze/70`}
      >
        {isSearchMatch && (
          <div
            className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white z-10 shadow-lg ${
              isActiveSearch
                ? "bg-bronze animate-pulse"
                : "bg-bronze/80"
            }`}
          >
            <Search className="w-3 h-3" />
          </div>
        )}

        <div
          className={`w-full h-full rounded-full bg-gradient-to-br border flex items-center justify-center relative overflow-hidden my-0.5 shadow-inner shrink-0 ${genderAvatarStyle}`}
        >
          <User
            className={`w-15 h-15 ${
              p.gender === "male" ? "text-ink/60" : "text-amber-700/60"
            }`}
          />
        </div>

        <div className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!p.spouseId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.setAddingRelation(p.id, "spouse");
              }}
              className="pointer-events-auto absolute right-[-14px] top-[50%] -translate-y-1/2 w-6 h-6 rounded-full bg-pine hover:bg-bronze text-vellum hover:text-ink border border-bronze flex items-center justify-center shadow-lg transition-all duration-200 ease-out z-50 transform cursor-pointer group/btn"
              title="Add Spouse"
            >
              <span className="text-sm font-bold leading-none select-none">
                +
              </span>
              <span className="absolute left-[115%] top-1/2 -translate-y-1/2 bg-pine text-vellum text-[9.5px] px-2 py-0.5 rounded shadow-xl border border-bronze/30 whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 pointer-events-none z-[1002]">
                Ханиа нэмэх (Add Spouse)
              </span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              data.setAddingRelation(p.id, "child");
            }}
            className="pointer-events-auto absolute bottom-[-14px] left-[50%] -translate-x-1/2 w-6 h-6 rounded-full bg-pine hover:bg-bronze text-vellum hover:text-ink border border-bronze flex items-center justify-center shadow-lg transition-all duration-200 ease-out z-50 transform cursor-pointer group/btn"
            title="Add Child"
          >
            <span className="text-sm font-bold leading-none select-none">
              +
            </span>
            <span className="absolute top-[115%] left-1/2 -translate-x-1/2 bg-pine text-vellum text-[9.5px] px-2 py-0.5 rounded shadow-xl border border-bronze/30 whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 pointer-events-none z-[1002]">
              Хүүхэд нэмэх (Add Child)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
