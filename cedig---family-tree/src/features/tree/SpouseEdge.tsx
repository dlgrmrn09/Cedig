"use client";

import { BaseEdge, type EdgeProps } from "@xyflow/react";

export default function SpouseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const controlX = sourceX + (targetX - sourceX) * 0.5;
  const path = `M ${sourceX} ${sourceY} C ${controlX} ${sourceY}, ${controlX} ${targetY}, ${targetX} ${targetY}`;

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: "#C4956A",
        strokeWidth: 4,
        strokeLinecap: "round",
      }}
    />
  );
}
