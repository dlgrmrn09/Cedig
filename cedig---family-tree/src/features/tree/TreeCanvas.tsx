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

import { motion, AnimatePresence } from "motion/react";
import { UserPlus } from "lucide-react";

import PersonNode from "./PersonNode";
import MarriageNode from "./MarriageNode";
import SpouseEdge from "./SpouseEdge";
import ChildEdge from "./ChildEdge";
import TreeSearchSidebar from "./TreeSearchSidebar";
import ZoomControls from "./ZoomControls";
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
    rfEdges,
    peopleLoaded,
    onNodesChange,
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
    setAddingRelation,
    searchMatches,
    activeSearchIndex,
    goToNextSearchResult,
    goToPrevSearchResult,
  } = useTreeCanvas();

  const isEmptyTree = peopleLoaded && rfNodes.length === 0;

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

        {/* Empty Tree Onboarding CTA */}
        <AnimatePresence>
          {isEmptyTree && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="pointer-events-auto bg-[#FAF6EE] rounded-3xl border border-bronze/20 shadow-xl px-8 py-8 max-w-sm w-full mx-4 text-center space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-bronze/10 flex items-center justify-center">
                  <UserPlus className="w-10 h-10 text-bronze" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-ink leading-snug">
                    Таны ургийн мод одоогоор хоосон байна
                  </h3>
                </div>
                <button
                  onClick={() => setAddingRelation("_root", "root")}
                  className="inline-flex items-center gap-2 bg-pine text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity shadow-lg uppercase tracking-wider"
                >
                  <span className="text-lg leading-none">+</span>
                  Гишүүн нэмэх
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM RIGHT FLOATING CANVAS Scale/Zoom controls PANEL */}
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev: boolean) => !prev)}
        />
      </div>

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
