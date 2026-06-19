"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import type { MarriageNodeData } from "./types";

export default function MarriageNode({ data }: { data: MarriageNodeData }) {
  return (
    <div className="relative flex items-center justify-center w-8 h-8 select-none group">
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-1 h-1"
        id="left"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="opacity-0 w-1 h-1"
        id="right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 w-1 h-1"
        id="bottom"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="opacity-0 w-1 h-1"
        id="top"
      />

      <button
        type="button"
        className="w-[22px] h-[22px] rotate-45 bg-gradient-to-br from-bronze to-[#A67B52] border border-[#D4A574] shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-110 hover:from-bronze hover:to-bronze"
        onClick={(e) => {
          if (data.hasChildren) {
            e.stopPropagation();
            data.onToggleCollapse();
          }
        }}
        title={
          data.hasChildren ? "Салбар хумих / дэлгэх" : "Батлагдсан холбоос"
        }
        aria-label={data.hasChildren ? (data.isCollapsed ? "Салбар дэлгэх" : "Салбар хумих") : "Батлагдсан холбоос"}
      >
        {data.hasChildren && (
          <span className="-rotate-45 text-[9px] font-extrabold text-ink leading-none select-none">
            {data.isCollapsed ? "+" : "−"}
          </span>
        )}
      </button>

      {data.hasChildren && (
        <span className="absolute bottom-[125%] bg-pine text-vellum text-[8.5px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          {data.isCollapsed ? "Салбар дэлгэх" : "Салбар хумих"}
        </span>
      )}
    </div>
  );
}
