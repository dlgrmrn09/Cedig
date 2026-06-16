"use client";

import { BaseEdge, type EdgeProps } from "@xyflow/react";

const BUS_OFFSET_ABOVE_CHILD = 48;
const CORNER_RADIUS = 10;

function buildBusPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): string {
  const busY = ty - BUS_OFFSET_ABOVE_CHILD;
  const verticalGapToBus = busY - sy;

  if (verticalGapToBus < CORNER_RADIUS * 2) {
    if (Math.abs(sx - tx) < 2) {
      return `M ${sx} ${sy} L ${tx} ${ty}`;
    }
    const midY = (sy + ty) / 2;
    return [
      `M ${sx} ${sy}`,
      `L ${sx} ${midY}`,
      `L ${tx} ${midY}`,
      `L ${tx} ${ty}`,
    ].join(" ");
  }

  if (Math.abs(sx - tx) < 2) {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }

  const cr = Math.min(CORNER_RADIUS, Math.abs(tx - sx) / 2);
  const isRight = tx > sx;
  const dir = isRight ? 1 : -1;

  return [
    `M ${sx} ${sy}`,
    `L ${sx} ${busY - cr}`,
    `Q ${sx} ${busY}, ${sx + dir * cr} ${busY}`,
    `L ${tx - dir * cr} ${busY}`,
    `Q ${tx} ${busY}, ${tx} ${busY + cr}`,
    `L ${tx} ${ty}`,
  ].join(" ");
}

export default function ChildEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const path = buildBusPath(sourceX, sourceY, targetX, targetY);

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
