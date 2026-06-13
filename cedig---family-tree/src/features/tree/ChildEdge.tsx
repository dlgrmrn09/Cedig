"use client";

import { BaseEdge, type EdgeProps } from "@xyflow/react";

export default function ChildEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const midY = sourceY + (targetY - sourceY) / 2;

  const generateSmoothPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    sY: number,
    r: number = 16,
  ) => {
    if (Math.abs(x1 - x2) < 2) {
      return `M ${x1} ${y1} L ${x1} ${y2}`;
    }

    const d1 = sY - y1;
    const d2 = y2 - sY;
    const hd = Math.abs(x2 - x1);
    const ar = Math.min(r, d1, d2, hd / 2);
    const dir = x2 > x1 ? 1 : -1;

    return [
      `M ${x1} ${y1}`,
      `L ${x1} ${sY - ar}`,
      `Q ${x1} ${sY}, ${x1 + dir * ar} ${sY}`,
      `L ${x2 - dir * ar} ${sY}`,
      `Q ${x2} ${sY}, ${x2} ${sY + ar}`,
      `L ${x2} ${y2}`,
    ].join(" ");
  };

  const path = generateSmoothPath(
    sourceX,
    sourceY,
    targetX,
    targetY,
    midY,
    16,
  );

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: "#8B7355",
        strokeWidth: 2.5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
  );
}
