"use client";

import React from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import PersonNode from "./PersonNode";
import MarriageNode from "./MarriageNode";
import SpouseEdge from "./SpouseEdge";
import ChildEdge from "./ChildEdge";
import TreeSearchSidebar from "./TreeSearchSidebar";
import ZoomControls from "./ZoomControls";
import FilterPanel from "./FilterPanel";
import TooltipPortal from "./TooltipPortal";
import { useTreeCanvas } from "./useTreeCanvas";

const nodeTypes: NodeTypes = {
  personNode: PersonNode,
  marriageNode: MarriageNode,
};

const edgeTypes: EdgeTypes = {
  spouse: SpouseEdge,
  child: ChildEdge,
};

function TreeCanvasInner() {
  const {
    rfNodes,
    onNodesChange,
    rfEdges,
    onEdgesChange,
    handleZoomIn,
    handleZoomOut,
    handleFitView,
    localSearch,
    setLocalSearch,
    handleSearchKeyPress,
    isLeftSidebarCollapsed,
    setIsLeftSidebarCollapsed,
    hoveredPerson,
    hoveredRect,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    resetFilters,
    clanList,
    setActivePersonId,
    searchMatches,
    activeSearchIndex,
    goToNextSearchResult,
    goToPrevSearchResult,
  } = useTreeCanvas();

  return (
    <div className="w-full h-full flex relative overflow-hidden font-sans-ui text-ink bg-vellum transition-all">
      {/* LEFT HAND SIDE BAR: Tree Statistics, Direct Quick Search, and Curation Tips */}
      <TreeSearchSidebar
        isCollapsed={isLeftSidebarCollapsed}
        onToggle={() => setIsLeftSidebarCollapsed((prev: boolean) => !prev)}
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onSubmit={handleSearchKeyPress}
        searchResultCount={searchMatches.length}
        activeSearchIndex={activeSearchIndex}
        onNextResult={goToNextSearchResult}
        onPrevResult={goToPrevSearchResult}
      />

      {/* INFINITE REACT FLOW CANVAS BODY */}
      <div className="flex-grow h-full relative overflow-hidden">
        {/* React Flow Core element */}
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={2.5}
          nodesDraggable={false}
          className="w-full h-full"
          onPaneClick={() => setActivePersonId(null)}
        >
          {/* Ambient grid accent */}
          <Background
            variant={BackgroundVariant.Dots}
            color="#C4956A"
            gap={18}
            size={1}
            style={{ opacity: 0.35 }}
          />
        </ReactFlow>

        {/* BOTTOM RIGHT FLOATING CANVAS Scale/Zoom controls PANEL */}
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev: boolean) => !prev)}
        />
      </div>

      {/* RIGHT HAND SIDE FILTER PANE - Desktop sidebar, Mobile overlay */}
      <FilterPanel
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {}}
        onReset={resetFilters}
        clanOptions={clanList}
      />

      {/* Floating details hover tooltip rendered outside React Flow viewport using secure Portals */}
      {hoveredPerson && hoveredRect && (
        <TooltipPortal person={hoveredPerson} rect={hoveredRect} />
      )}
    </div>
  );
}

// Wrap with ReactFlowProvider to access hook values smoothly inside tree actions
export default function TreeCanvas() {
  return (
    <ReactFlowProvider>
      <TreeCanvasInner />
    </ReactFlowProvider>
  );
}
