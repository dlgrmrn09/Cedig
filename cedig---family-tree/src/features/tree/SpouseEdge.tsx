"use client";

import { BaseEdge, type EdgeProps } from "@xyflow/react";

function buildOrthogonalPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): string {
  const vertDrop = 14;

  return [
    `M ${sx} ${sy}`,
    `L ${sx} ${sy + vertDrop}`,
    `L ${tx} ${sy + vertDrop}`,
    `L ${tx} ${ty}`,
  ].join(" ");
}

export default function SpouseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY);

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
        strokeLinejoin: "round",
      }}
    />
  );
}
