"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "motion/react";
import { User, Search } from "lucide-react";
import type { PersonNodeData } from "./types";
import Image from "next/image";
const handleClass = "opacity-0 w-2 h-2";

const haloVariants = {
  idle: { opacity: 0.3, scale: 1 },
  hover: { opacity: 0.6, scale: 1.12 },
  active: { opacity: 0.8, scale: 1.08 },
};

const nodeVariants = {
  initial: {
    scale: 0.6,
    opacity: 0,
    filter: "blur(8px)",
  },
  animate: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 16,
      mass: 0.6,
    },
  },
  exit: {
    scale: 0.6,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

function PersonNodeInner({ data }: { data: PersonNodeData }) {
  const p = data.person;
  const isSearchMatch = data.isSearchMatch;
  const isActiveSearch = data.isActiveSearch;
  const isActive = data.isActive;
  const isHighlighted = isSearchMatch || isActive || isActiveSearch;

  const genderHalo =
    p.gender === "male"
      ? "radial-gradient(circle, rgba(43,76,59,0.18) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(196,149,106,0.22) 0%, transparent 70%)";

  const borderColor = isActiveSearch
    ? "#C4956A"
    : isSearchMatch
      ? "#C4956A"
      : isActive
        ? "#C4956A80"
        : "rgba(0,0,0,0.08)";

  const shadowColor = isActiveSearch
    ? "0 0 28px 10px rgba(196,149,106,0.45)"
    : isSearchMatch
      ? "0 0 16px 4px rgba(196,149,106,0.3)"
      : isActive
        ? "0 0 12px 3px rgba(196,149,106,0.2)"
        : "0 2px 12px rgba(0,0,0,0.06)";

  return (
    <div
      className="group relative select-none overflow-visible"
      style={{ width: 128, height: 156 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={handleClass}
        id="top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleClass}
        id="bottom"
      />
      <Handle
        type="source"
        position={Position.Right}
        className={handleClass}
        id="right"
      />
      <Handle
        type="target"
        position={Position.Left}
        className={handleClass}
        id="left"
      />

      <motion.div
        variants={nodeVariants}
        initial="initial"
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          y: [0, -3, 0],
          transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 16,
            mass: 0.6,
            y: {
              repeat: Infinity,
              repeatType: "mirror" as const,
              duration: 3,
              ease: "easeInOut" as const,
            },
          },
        }}
        exit="exit"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        style={{ zIndex: isHighlighted ? 1001 : "auto" }}
      >
        <motion.div
          variants={haloVariants}
          animate={isHighlighted ? "active" : "idle"}
          whileHover="hover"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full pointer-events-none"
          style={{ background: genderHalo }}
        />

        <div
          onClick={(e) => {
            e.stopPropagation();
            data.setActivePersonId(p.id);
          }}
          onMouseEnter={(e) => data.onHoverEnter(e, p)}
          onMouseLeave={() => data.onHoverLeave()}
          className="relative cursor-pointer rounded-full flex items-center justify-center"
          style={{
            width: 104,
            height: 104,
            boxShadow: shadowColor,
            border: `2px solid ${borderColor}`,
            transition: "box-shadow 0.35s ease, border-color 0.35s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(250,246,238,0.78) 40%, rgba(240,235,225,0.72) 100%)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          <div className="absolute inset-[3px] rounded-full overflow-hidden">
            {p.avatarUrl ? (
              <Image
                src={p.avatarUrl}
                alt={`${p.firstName} ${p.lastName}`}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${
                p.avatarUrl ? "hidden" : ""
              }`}
              style={{
                background:
                  p.gender === "male"
                    ? "linear-gradient(135deg, rgba(43,76,59,0.12) 0%, rgba(43,76,59,0.04) 100%)"
                    : "linear-gradient(135deg, rgba(196,149,106,0.15) 0%, rgba(180,83,9,0.05) 100%)",
              }}
            >
              <User
                className={`w-10 h-10 ${
                  p.gender === "male"
                    ? "text-[#2B4C3B]/50"
                    : "text-amber-700/50"
                }`}
                strokeWidth={1.5}
              />
            </div>

            {p.avatarUrl && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.18) 100%)",
                }}
              />
            )}
          </div>

          {isSearchMatch && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg"
              style={{
                background: isActiveSearch
                  ? "#C4956A"
                  : "rgba(196,149,106,0.85)",
              }}
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}

          {p.verified && (
            <div
              className="absolute -top-1 -left-1 w-4 h-4 rounded-full z-10"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 0 6px rgba(34,197,94,0.5)",
              }}
            />
          )}
        </div>

        <div
          className="mt-1.5 px-2.5 py-0.5 rounded-full text-center"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "1px solid rgba(0,0,0,0.06)",
            maxWidth: 120,
            overflow: "hidden",
          }}
        >
          <p
            className="text-[10px] font-semibold tracking-tight truncate"
            style={{ color: "#2B2B2B" }}
          >
            {p.firstName}
          </p>
          {p.clanName && (
            <p
              className="text-[8px] font-medium tracking-wide truncate"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              {p.clanName}
            </p>
          )}
        </div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {!p.spouseId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.setAddingRelation(p.id, "spouse");
            }}
            className="pointer-events-auto absolute right-[-18px] top-[20%] -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-bronze/30 text-bronze hover:bg-bronze hover:text-white flex items-center justify-center shadow-lg transition-all duration-200 ease-out cursor-pointer group/btn"
            title="Add Spouse"
          >
            <span className="text-sm font-bold leading-none select-none">
              +
            </span>
            <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-ink text-vellum text-[9px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 pointer-events-none z-[1002]">
              Add Spouse
            </span>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            data.setAddingRelation(p.id, "child");
          }}
          className="pointer-events-auto absolute bottom-[40px] left-[50%] -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-bronze/30 text-bronze hover:bg-bronze hover:text-white flex items-center justify-center shadow-lg transition-all duration-200 ease-out cursor-pointer group/btn"
          title="Add Child"
        >
          <span className="text-sm font-bold leading-none select-none">+</span>
          <span className="absolute top-[120%] left-1/2 -translate-x-1/2 bg-ink text-vellum text-[9px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 pointer-events-none z-[1002]">
            Add Child
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(PersonNodeInner);
