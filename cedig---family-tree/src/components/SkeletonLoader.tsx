'use client';

import React from 'react';
import { motion } from 'motion/react';

/**
 * Premium Shimmer effect Overlay
 * Provides a soft sweeping gradient movement to resemble Linear / Notion UI designs.
 */
export function Shimmer() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] pointer-events-none"
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// 1. ANCESTRAL TREE CANVAS SKELETON
export function TreeSkeleton() {
  return (
    <div 
      aria-busy="true"
      aria-label="Овгийн мод ачаалж байна"
      className="w-full h-full min-h-[500px] flex bg-[#F5F0E8] relative overflow-hidden select-none"
    >
      <Shimmer />
      
      {/* Mockup Left Sidebar to prevent layout shift */}
      <div className="w-72 p-6 border-r border-[#C4956A]/20 bg-white/70 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0 relative z-30">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C4956A]">Архивын удирдлага</span>
            <div className="h-6 bg-[#1A1A2E]/25 rounded w-32" />
          </div>
          <div className="space-y-2 pt-4 border-t border-[#1A1A2E]/10">
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-24" />
            <div className="h-10 bg-[#F5F0E8] border border-[#1A1A2E]/15 rounded-xl" />
          </div>
          <div className="space-y-3 pt-4 border-t border-[#1A1A2E]/10">
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-36" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-[#F5F0E8]/70 rounded-xl" />
              <div className="h-10 bg-[#F5F0E8]/70 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="h-8 bg-stone-100 rounded-xl w-full" />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-grow h-full relative overflow-hidden flex flex-col items-center justify-center p-8 bg-[#F5F0E8]">
        {/* Simulation of nested family nodes */}
        <div className="flex flex-col items-center space-y-10 relative z-10 w-full max-w-2xl">
          {/* Level 1: Ancestors */}
          <div className="flex gap-8 relative items-center">
            <div className="w-[115px] h-[115px] rounded-full bg-white border-2 border-[#1A1A2E]/15 shadow-md flex flex-col justify-center items-center p-2">
              <div className="w-9 h-9 rounded-full bg-stone-200/60 mb-2" />
              <div className="h-2.5 bg-stone-300 rounded w-14 mb-1" />
              <div className="h-2 bg-stone-200 rounded w-10" />
            </div>
            <div className="w-16 h-0.5 border-t-2 border-dashed border-[#C4956A]/45" />
            <div className="w-[115px] h-[115px] rounded-full bg-white border-2 border-[#1A1A2E]/15 shadow-md flex flex-col justify-center items-center p-2">
              <div className="w-9 h-[36px] rounded-full bg-stone-200/60 mb-2" />
              <div className="h-2.5 bg-stone-300 rounded w-14 mb-1" />
              <div className="h-2 bg-stone-200 rounded w-10" />
            </div>
          </div>

          {/* Vertical connecter */}
          <div className="w-0.5 h-10 border-l-2 border-dashed border-[#C4956A]/30" />

          {/* Level 2: Children with sublines */}
          <div className="grid grid-cols-2 gap-24 w-full relative">
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-[#C4956A]/30" />
            
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 border-l-2 border-dashed border-[#C4956A]/30" />
              <div className="w-[115px] h-[115px] rounded-full bg-white border-2 border-[#1A1A2E]/15 shadow-md flex flex-col justify-center items-center p-2">
                <div className="w-9 h-9 rounded-full bg-stone-200/60 mb-2" />
                <div className="h-2.5 bg-stone-300 rounded w-14 mb-1" />
                <div className="h-2 bg-stone-200 rounded w-10" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 border-l-2 border-dashed border-[#C4956A]/30" />
              <div className="w-[115px] h-[115px] rounded-full bg-white border-2 border-[#1A1A2E]/15 shadow-md flex flex-col justify-center items-center p-2">
                <div className="w-9 h-9 rounded-full bg-stone-200/60 mb-2" />
                <div className="h-2.5 bg-stone-300 rounded w-14 mb-1" />
                <div className="h-2 bg-stone-200 rounded w-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-[#1A1A2E]/40 font-mono text-[10px] uppercase tracking-widest font-bold">
          Овгийн мод уншиж байна...
        </div>
      </div>

      {/* Mockup Right Sidebar to prevent layout shift */}
      <div className="w-80 border-l border-[#C4956A]/20 bg-white/80 backdrop-blur-md p-6 flex flex-col justify-between hidden lg:flex shrink-0 relative z-30">
        <div className="space-y-6">
          <div className="space-y-2 pb-4 border-b border-[#1A1A2E]/10">
            <div className="h-4 bg-[#1A1A2E]/25 rounded w-36" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-24" />
            <div className="h-10 bg-[#F5F0E8] border border-[#1A1A2E]/15 rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-28" />
            <div className="space-y-2">
              <div className="h-2 bg-stone-200 rounded" />
              <div className="h-2 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-12 bg-[#1A1A2E] rounded-xl" />
          <div className="h-10 bg-white border border-[#1A1A2E]/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 2. CARD LIST SKELETON (Biographies index, key ledgers)
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl border border-stone-200/80 p-6 flex flex-col justify-between space-y-4 animate-pulse relative overflow-hidden"
        >
          <Shimmer />
          <div className="space-y-2">
            {/* Tag or category indicator */}
            <div className="h-3 bg-[#C4956A]/15 rounded-md w-1/4" />
            {/* Title / Name header */}
            <div className="h-5 bg-[#1A1A2E]/25 rounded-md w-2/3" />
            {/* Bio description lines */}
            <div className="space-y-2 pt-2">
              <div className="h-2.5 bg-stone-200 rounded w-full" />
              <div className="h-2.5 bg-stone-200 rounded w-11/12" />
              <div className="h-2.5 bg-stone-200 rounded w-4/5" />
            </div>
          </div>

          {/* Card footer details metadata */}
          <div className="flex justify-between items-center pt-4 border-t border-stone-100">
            <div className="h-3 bg-stone-200/75 rounded w-1/4" />
            <div className="h-8 bg-[#1A1A2E]/15 rounded w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 3. PHOTO GRID SKELETON
export function PhotoGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-3 gap-6 w-full" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md animate-pulse flex flex-col relative"
        >
          <Shimmer />
          {/* Main Visual Image bounding box */}
          <div className="h-48 w-full bg-stone-200/50" />
          
          <div className="p-4 space-y-2">
            <div className="h-4 bg-[#1A1A2E]/25 rounded w-1/2" />
            <div className="h-[18px] bg-[#1A1A2E]/10 rounded w-full" />
            <div className="h-3 bg-stone-200 rounded w-3/4" />
            
            <div className="flex justify-between items-center border-t border-stone-100 pt-3">
              <div className="h-3 bg-stone-200 rounded w-1/4" />
              <div className="h-3 bg-stone-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 3b. DOCUMENT GRID SKELETON
export function DocGridSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 gap-6 w-full animate-pulse" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white p-5 border border-stone-200 rounded-2xl flex items-start gap-4 shadow-sm relative overflow-hidden"
        >
          <Shimmer />
          {/* Left icon placeholder container */}
          <div className="w-12 h-12 rounded-xl bg-[#C4956A]/10 shrink-0" />
          
          {/* Right content flex area */}
          <div className="space-y-2 flex-grow">
            <div className="space-y-1">
              <div className="h-4 bg-[#1A1A2E]/25 rounded w-1/2" />
              <div className="h-2.5 bg-stone-300 rounded w-1/3" />
            </div>
            <div className="h-3 bg-stone-200 rounded w-11/12 mt-1" />
            
            {/* Divider and bottom action row */}
            <div className="flex justify-between items-center pt-3 border-t border-stone-100">
              <div className="h-2.5 bg-[#C4956A]/20 rounded w-1/3" />
              <div className="h-4 bg-[#1A1A2E]/15 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 3c. ACCESS/PRIVACY SHEET SKELETON
export function AccessSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-[#C4956A]/20 shadow-xl space-y-8 animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="space-y-2">
        <div className="h-5 bg-[#1A1A2E]/25 rounded w-1/3" />
        <div className="h-3.5 bg-stone-400/35 rounded w-1/2" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left sharing settings block */}
        <div className="p-5 rounded-2xl bg-[#F5F0E8]/55 border border-[#C4956A]/10 space-y-4">
          <div className="h-3 bg-[#C4956A]/25 rounded w-2/3" />
          <div className="space-y-2">
            <div className="h-2.5 bg-stone-300 rounded w-full" />
            <div className="h-2.5 bg-stone-300 rounded w-5/6" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-250 flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-stone-200 rounded w-16" />
              <div className="h-4 bg-[#1A1A2E]/20 rounded w-28" />
            </div>
            <div className="h-8 bg-stone-200 rounded-lg w-20" />
          </div>
        </div>

        {/* Right invite form block */}
        <div className="p-5 rounded-2xl bg-[#1A1A2E]/5 border border-[#1A1A2E]/5 space-y-4">
          <div className="h-3 bg-[#1A1A2E]/25 rounded w-1/3" />
          <div className="space-y-1.5">
            <div className="h-3 bg-stone-300 rounded w-1/4" />
            <div className="h-10 bg-white border border-[#1A1A2E]/15 rounded-xl w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-300 rounded w-1/3" />
              <div className="h-10 bg-white border border-[#1A1A2E]/15 rounded-xl w-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-300 rounded w-1/3" />
              <div className="h-10 bg-white border border-[#1A1A2E]/15 rounded-xl w-full" />
            </div>
          </div>
          <div className="h-10 bg-[#1A1A2E]/80 rounded-xl w-full mt-4" />
        </div>
      </div>

      <div className="border-t border-stone-100 pt-6 space-y-4">
        <div className="h-4 bg-[#C4956A]/25 rounded w-1/4" />
        <div className="space-y-3">
          {/* Owner row skeleton */}
          <div className="bg-stone-50/50 p-4 border border-stone-200 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1A1A2E]/15" />
              <div className="space-y-1.5">
                <div className="h-3 bg-[#1A1A2E]/20 rounded w-24" />
                <div className="h-2.5 bg-stone-300 rounded w-32" />
              </div>
            </div>
            <div className="h-5 bg-[#C4956A]/20 rounded w-16" />
          </div>
          {/* Invites rows */}
          <div className="p-4 border border-stone-100 rounded-xl flex justify-between items-center bg-white/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100" />
              <div className="space-y-1.5">
                <div className="h-3 bg-stone-300 rounded w-36" />
                <div className="h-2.5 bg-stone-250 rounded w-20" />
              </div>
            </div>
            <div className="h-5 bg-stone-200 rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. FORM AND CONTROL SETTINGS SKELETON
export function FormSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      
      {/* Settings Header with breadcrumb matching */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b-2 border-[#C4956A]/20">
        <div className="space-y-2">
          <div className="h-3 bg-[#735c00]/30 rounded w-32" />
          <div className="h-7 bg-[#3D2B1F]/30 rounded w-64" />
          <div className="h-3.5 bg-stone-400/40 rounded w-80" />
        </div>
        <div className="h-10 bg-white border border-stone-200 rounded-xl w-24" />
      </div>

      {/* Grid wrapper matching the 1:3 column structure */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left tabs column */}
        <div className="md:col-span-1 space-y-1">
          <div className="h-3.5 bg-stone-300 rounded w-2/3 mb-4" />
          <div className="h-11 bg-[#1A1A2E]/10 rounded-xl w-full" />
          <div className="h-11 bg-stone-100 rounded-xl w-full" />
          <div className="h-11 bg-stone-100 rounded-xl w-full" />
          <div className="h-11 bg-stone-100 rounded-xl w-full text-red-500" />
        </div>

        {/* Right card content column (3 parts) */}
        <div className="md:col-span-3 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Section banner matching layout */}
          <div className="pb-4 border-b border-stone-200/50 flex justify-between items-center">
            <div className="space-y-1.5 flex-grow">
              <div className="h-5 bg-[#1A1A2E]/25 rounded w-1/3" />
              <div className="h-3 bg-stone-350 rounded w-1/2" />
            </div>
            <div className="w-5 h-5 rounded-full bg-[#C4956A]/10 shrink-0" />
          </div>

          {/* Interactive profile avatar section representation */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#F5F0E8]/35 border border-[#C4956A]/10">
            <div className="w-24 h-24 rounded-full bg-stone-250 relative shrink-0" />
            <div className="space-y-2 flex-grow text-center sm:text-left w-full sm:w-auto">
              <div className="h-3.5 bg-[#1A1A2E]/15 rounded-full w-24 mx-auto sm:mx-0" />
              <div className="h-4 bg-[#1A1A2E]/20 rounded w-36 mx-auto sm:mx-0" />
              <div className="h-3 bg-stone-300 rounded w-5/6 mx-auto sm:mx-0" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 bg-[#1A1A2E]/20 rounded w-1/4" />
                <div className="h-10 bg-stone-200/60 rounded-xl w-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 bg-[#1A1A2E]/20 rounded w-1/4" />
                <div className="h-10 bg-stone-200/60 rounded-xl w-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-3 bg-[#1A1A2E]/20 rounded w-1/6" />
              <div className="h-24 bg-stone-200/60 rounded-xl w-full" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#735c00]/10">
              <div className="h-9 bg-stone-200 rounded-lg w-20" />
              <div className="h-9 bg-[#1A1A2E]/15 rounded-lg w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. LANDING PAGE SKELETON
export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col justify-between p-6 md:p-12 animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      {/* Navigation bar skeleton */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-[#735c00]/10 pb-6 mb-12">
        <div className="h-6 bg-[#1A1A2E]/25 rounded w-28" />
        <div className="hidden md:flex gap-6">
          <div className="h-30 w-16 bg-stone-300/70 rounded" />
          <div className="h-30 w-16 bg-stone-300/70 rounded" />
          <div className="h-30 w-16 bg-stone-300/70 rounded" />
        </div>
        <div className="h-10 bg-[#1A1A2E]/15 rounded-xl w-32" />
      </div>

      {/* Hero section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto pt-10">
        <div className="h-12 bg-[#1A1A2E]/25 rounded-2xl w-3/4 mx-auto" />
        <div className="h-12 bg-[#1A1A2E]/25 rounded-2xl w-1/2 mx-auto" />
        <div className="h-4 bg-stone-400/40 rounded-lg w-5/6 mx-auto pt-2" />
        <div className="h-4 bg-stone-400/40 rounded-lg w-2/3 mx-auto" />
        
        <div className="flex justify-center gap-4 pt-8">
          <div className="h-12 bg-[#1A1A2E]/20 rounded-xl w-40" />
          <div className="h-12 bg-stone-300/80 rounded-xl w-40" />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto h-64 bg-stone-300/30 rounded-3xl border border-stone-400/10 mt-12" />
    </div>
  );
}

// 6. ENTIRE PAGE/LAYOUT BACKDROP SKELETON
export function FullPageSkeleton() {
  return (
    <div className="min-h-screen flex text-[#1A1A2E] bg-[#F5F0E8] overflow-hidden select-none animate-pulse relative" aria-busy="true">
      <Shimmer />
      {/* Mock Sidebar menu */}
      <div className="w-64 bg-[#1A1A2E]/95 h-screen border-r-[5px] border-[#C4956A]/40 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          <div className="space-y-2 pb-4 border-b border-white/10">
            <div className="h-6 bg-white/20 rounded w-1/2" />
            <div className="h-2.5 bg-[#C4956A]/30 rounded w-1/3" />
          </div>
          
          <div className="space-y-4">
            <div className="h-10 bg-white/10 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
          </div>
        </div>

        <div className="h-10 bg-white/10 rounded-xl w-1/2" />
      </div>

      {/* Main Container section */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header bar indicators */}
        <header className="h-20 border-b border-[#C4956A]/10 bg-white/50 backdrop-blur justify-between flex items-center px-8 shrink-0">
          <div className="h-5 bg-stone-400/30 rounded w-48" />
          <div className="flex items-center gap-4">
            <div className="h-9 bg-stone-200/80 rounded-xl w-32" />
            <div className="w-9 h-9 bg-stone-300 rounded-full" />
          </div>
        </header>

        {/* Content canvas dynamic */}
        <div className="p-8 flex-grow space-y-6 overflow-auto">
          <div className="space-y-2">
            <div className="h-8 bg-[#1A1A2E]/25 rounded w-1/3" />
            <div className="h-3 bg-stone-400/30 rounded w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="h-40 bg-white rounded-2xl border border-stone-200" />
            <div className="h-40 bg-white rounded-2xl border border-stone-200" />
            <div className="h-40 bg-white rounded-2xl border border-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. HISTORICAL FAMILY RECODRDS BOOK VIEW / "SHAŞTIR" INTERACTIVE SPREAD SKELETON
export function BookSkeleton() {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 md:p-6 lg:p-8 select-none" aria-busy="true">
      {/* Simulation/Skeleton of the main book card */}
      <div className="relative z-10 w-full max-w-[1240px] h-full md:h-[780px] lg:h-[820px] max-h-[90vh] flex flex-col md:flex-row rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden border-[10px] border-[#251A13] bg-[#2E2017] animate-pulse">
        <Shimmer />
        
        {/* Mock Top Book Caption Bar */}
        <div className="absolute top-0 inset-x-0 h-10 bg-[#3B291D] border-b border-[#251A13] flex items-center justify-between px-6 z-20 text-white/50 text-[10px] uppercase font-black tracking-widest">
          <div className="flex items-center gap-2">
            <span className="text-[#C4956A]">✦</span>
            <div className="h-3 bg-white/25 rounded w-48" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-3 bg-white/20 rounded w-24" />
            <div className="h-6 bg-white/10 rounded w-16 border border-white/10" />
          </div>
        </div>

        {/* PAGE INDEXES TABS ON LEFT */}
        <div className="absolute left-0 top-36 -ml-[48px] z-20 flex flex-col gap-3">
          <div className="w-12 h-14 rounded-l-xl bg-[#FAF6EE] border border-r-0 border-[#2E2017]/30 flex items-center justify-center translate-x-1" />
          <div className="w-12 h-14 rounded-l-xl bg-[#FAF6EE]/70 border border-r-0 border-[#2E2017]/30 flex items-center justify-center" />
        </div>

        {/* DUAL PAGE WRAPPER */}
        <div className="flex-grow flex flex-col md:flex-row bg-[#FAF6EE] relative overflow-hidden pt-10 pb-8 px-6 md:px-0">
          {/* SPINE EFFECT */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[14px] -ml-[7px] bg-gradient-to-r from-black/55 via-black/85 to-black/55 pointer-events-none hidden md:block z-30" />
          
          {/* Left Page content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between h-full space-y-6 md:pr-10">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {/* Profile Portrait box: matches height and width exactly */}
                <div className="w-28 h-36 bg-stone-300 rounded-xl shrink-0 border-2 border-[#1A1A2E]/20 shadow" />
                <div className="space-y-3 w-full">
                  <div className="h-4 bg-[#C4956A]/35 rounded w-1/3" />
                  <div className="h-6 bg-[#1A1A2E]/30 rounded w-2/3" />
                  <div className="h-4 bg-stone-300 rounded w-1/2" />
                </div>
              </div>

              {/* Personal metadata grid mockup */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-stone-200/60 py-4 mt-4">
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-stone-300 rounded w-1/3" />
                  <div className="h-3.5 bg-stone-400/40 rounded w-2/3" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-stone-300 rounded w-1/4" />
                  <div className="h-3.5 bg-stone-400/40 rounded w-1/2" />
                </div>
              </div>

              {/* Bio lines */}
              <div className="space-y-2.5 pt-2">
                <div className="h-3 bg-stone-300 rounded w-full" />
                <div className="h-3 bg-stone-300 rounded w-11/12" />
                <div className="h-3 bg-stone-300 rounded w-4/5" />
                <div className="h-3 bg-stone-300 rounded w-[95%]" />
              </div>
            </div>

            <div className="h-8 bg-stone-200 rounded-xl w-32 self-center mt-auto" />
          </div>

          {/* Right Page content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between h-full space-y-6 md:pl-10">
            <div className="space-y-4">
              <div className="h-5 bg-[#1A1A2E]/25 rounded w-1/3 mb-2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-stone-300 rounded-lg relative overflow-hidden shadow-inner" />
                <div className="aspect-square bg-stone-300 rounded-lg relative overflow-hidden shadow-inner" />
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-stone-200/60 pt-4 mt-auto">
              <div className="h-8 bg-stone-300 rounded-lg w-24" />
              <div className="h-8 bg-stone-300 rounded-lg w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. TABLE DATA STRUCTURE SKELETON
export function TableSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200/70 overflow-hidden shadow-sm animate-pulse" aria-busy="true">
      <Shimmer />
      {/* Filtering inputs mockup */}
      <div className="p-4 border-b border-stone-100 flex justify-between items-center gap-4 bg-stone-50">
        <div className="h-9 bg-stone-200 rounded-lg w-1/3" />
        <div className="flex gap-2">
          <div className="h-9 bg-stone-200 rounded-lg w-20" />
          <div className="h-9 bg-stone-200 rounded-lg w-24" />
        </div>
      </div>

      {/* Table grid rows */}
      <div className="divide-y divide-stone-100">
        {/* Table header */}
        <div className="p-4 grid grid-cols-4 gap-4 bg-stone-100/50">
          <div className="h-4 bg-[#1A1A2E]/20 rounded w-1/2" />
          <div className="h-4 bg-stone-400/30 rounded w-1/3" />
          <div className="h-4 bg-stone-400/30 rounded w-1/3" />
          <div className="h-4 bg-stone-400/30 rounded w-1/4" />
        </div>

        {/* Rows mockups */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 grid grid-cols-4 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-200" />
              <div className="h-3 bg-stone-400/40 rounded w-24" />
            </div>
            <div className="h-3 bg-stone-300 rounded w-16" />
            <div className="h-3 bg-stone-300 rounded w-20" />
            <div className="h-5 bg-stone-200 rounded-lg w-14" />
          </div>
        ))}
      </div>

      {/* Pagination wrapper */}
      <div className="p-3 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
        <div className="h-3.5 bg-stone-350 rounded w-24" />
        <div className="flex gap-1.5">
          <div className="h-7 w-12 bg-stone-200 rounded" />
          <div className="h-7 w-12 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// 9. DRAWER DETAILS SIDE-PANEL SKELETON
export function DrawerSkeleton() {
  return (
    <div className="w-96 h-full bg-[#FCFAF2] border-l border-[#735c00]/15 p-6 space-y-6 flex flex-col justify-between animate-pulse" aria-busy="true">
      <div className="space-y-6">
        {/* Profile Avatar & Header block */}
        <div className="flex items-start gap-4 pb-6 border-b border-[#735c00]/10">
          <div className="w-20 h-24 bg-stone-300 rounded-xl" />
          <div className="space-y-2 w-full pt-1">
            <div className="h-5 bg-[#1A1A2E]/25 rounded w-2/3" />
            <div className="h-3 bg-[#C4956A]/35 rounded w-1/2" />
          </div>
        </div>

        {/* Traditional details blocks */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-2.5 bg-[#1A1A2E]/20 rounded w-1/4" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-[#1A1A2E]/20 rounded w-1/3" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-[#1A1A2E]/20 rounded w-1/5" />
            <div className="h-4 bg-stone-200 rounded w-2/3" />
          </div>
        </div>
      </div>

      {/* Manage buttons bottom */}
      <div className="flex gap-3 pt-6 border-t border-[#735c00]/10">
        <div className="h-10 bg-stone-200 rounded-xl w-full" />
        <div className="h-10 bg-[#1A1A2E]/15 rounded-xl w-full" />
      </div>
    </div>
  );
}

// 10. SYSTEM NOTIFICATIONS CARD SKELETON
export function NotificationsSkeleton() {
  return (
    <div className="space-y-3 w-full" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-xl border p-4 flex gap-3 shadow-sm animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-[#1A1A2E]/15 shrink-0" />
          <div className="space-y-1.5 flex-grow pt-0.5">
            <div className="h-3 bg-[#1A1A2E]/25 rounded w-1/3" />
            <div className="h-2.5 bg-stone-350 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 12. GENERAL PAGE SKELETON — wraps any page with title + content area
export function PageSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-7 bg-ink/25 rounded w-48" />
        <div className="h-9 bg-stone-200 rounded-xl w-full sm:w-72" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4 relative overflow-hidden">
            <div className="h-3 bg-bronze/15 rounded w-1/4" />
            <div className="h-5 bg-ink/25 rounded w-2/3" />
            <div className="space-y-2 pt-2">
              <div className="h-2.5 bg-stone-200 rounded w-full" />
              <div className="h-2.5 bg-stone-200 rounded w-11/12" />
              <div className="h-2.5 bg-stone-200 rounded w-4/5" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-stone-100">
              <div className="h-3 bg-stone-200/75 rounded w-1/4" />
              <div className="h-8 bg-ink/15 rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 13. SINGLE CARD SKELETON — used for stat cards, summary cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3 animate-pulse relative overflow-hidden ${className || ''}`} aria-busy="true">
      <Shimmer />
      <div className="flex justify-between items-center">
        <div className="h-3 bg-stone-300 rounded w-20" />
        <div className="w-8 h-8 rounded-lg bg-bronze/10" />
      </div>
      <div className="h-6 bg-ink/25 rounded w-24" />
      <div className="h-3 bg-stone-200 rounded w-16" />
    </div>
  );
}

// 14. DASHBOARD SKELETON — stat cards row + recent activity + tree cards
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 w-full animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      {/* Page Title */}
      <div className="h-7 bg-ink/25 rounded w-40" />

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="h-2.5 bg-stone-300 rounded w-16" />
              <div className="w-7 h-7 rounded-lg bg-bronze/10" />
            </div>
            <div className="h-6 bg-ink/20 rounded w-20" />
            <div className="h-2.5 bg-emerald-200/50 rounded w-14" />
          </div>
        ))}
      </div>

      {/* Two-column layout: Recent Activity + Quick Access */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-ink/20 rounded w-36" />
            <div className="h-6 bg-stone-200 rounded w-20" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50/50">
                <div className="w-2 h-2 rounded-full bg-bronze/30" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-stone-300 rounded w-3/4" />
                  <div className="h-2 bg-stone-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-stone-200 rounded-lg w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tree Cards (1/3 width) */}
        <div className="space-y-4">
          <div className="h-5 bg-ink/20 rounded w-28" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-ink/25 rounded w-24" />
                  <div className="h-2.5 bg-stone-300 rounded w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-stone-200 rounded-lg w-16" />
                <div className="h-6 bg-stone-200 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 15. PERSON DETAIL SKELETON — avatar, name, info, timeline
export function PersonSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      {/* Header bar */}
      <header className="h-16 border-b border-stone-200 bg-white flex items-center px-6 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-stone-200" />
        <div className="h-5 bg-ink/25 rounded w-48 ml-3" />
      </header>
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-200" />
              <div className="space-y-2">
                <div className="h-5 bg-ink/25 rounded w-36" />
                <div className="h-3 bg-stone-300 rounded w-24" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="h-2.5 bg-stone-300 rounded w-16" />
                <div className="h-4 bg-stone-200 rounded w-24" />
              </div>
              <div className="space-y-1">
                <div className="h-2.5 bg-stone-300 rounded w-12" />
                <div className="h-4 bg-stone-200 rounded w-20" />
              </div>
              <div className="space-y-1">
                <div className="h-2.5 bg-stone-300 rounded w-14" />
                <div className="h-4 bg-stone-200 rounded w-28" />
              </div>
              <div className="space-y-1">
                <div className="h-2.5 bg-stone-300 rounded w-10" />
                <div className="h-4 bg-stone-200 rounded w-32" />
              </div>
            </div>
            {/* Biography section */}
            <div className="pt-2 space-y-2">
              <div className="h-3 bg-stone-300 rounded w-16" />
              <div className="h-2.5 bg-stone-200 rounded w-full" />
              <div className="h-2.5 bg-stone-200 rounded w-11/12" />
              <div className="h-2.5 bg-stone-200 rounded w-4/5" />
            </div>
          </div>
          {/* Timeline section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 bg-ink/20 rounded w-32" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-0.5 bg-stone-200 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-stone-300 rounded w-1/3" />
                    <div className="h-2 bg-stone-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 16. ACTIVITY TIMELINE SKELETON — matches the timeline layout
export function ActivitySkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-6 animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
        <div className="h-6 bg-ink/25 rounded w-40" />
        <div className="h-9 bg-stone-200 rounded-xl w-full sm:w-72" />
      </div>
      <div className="relative border-l-2 border-bronze/20 pl-4 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-bronze/30" />
            <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-stone-300 rounded w-3/4" />
                  <div className="h-2.5 bg-stone-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-stone-200 rounded-lg w-14 shrink-0" />
              </div>
              <div className="flex justify-between items-center border-t border-stone-150 pt-2">
                <div className="h-2.5 bg-stone-200 rounded w-20" />
                <div className="h-2.5 bg-stone-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 17. SUBSCRIPTIONS / PRICING SKELETON — matches the pricing page layout
export function PricingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-8 animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
        <div>
          <div className="h-6 bg-ink/25 rounded w-40" />
        </div>
        <div className="h-6 bg-bronze/20 rounded-full w-32" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-stone-100 space-y-2">
            <div className="h-2.5 bg-stone-300 rounded w-1/2 mx-auto" />
            <div className="h-5 bg-ink/25 rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="space-y-3">
        <div className="h-4 bg-bronze/20 rounded w-48" />
        <div className="w-full border border-stone-100 rounded-xl overflow-hidden divide-y divide-stone-100">
          <div className="p-3 grid grid-cols-4 gap-4 bg-stone-50">
            <div className="h-3 bg-stone-300 rounded w-20" />
            <div className="h-3 bg-stone-300 rounded w-24" />
            <div className="h-3 bg-stone-300 rounded w-16" />
            <div className="h-3 bg-stone-300 rounded w-16 ml-auto" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-3 grid grid-cols-4 gap-4">
              <div className="h-3 bg-stone-200 rounded w-24" />
              <div className="h-3 bg-stone-200 rounded w-32" />
              <div className="h-3 bg-stone-200 rounded w-20" />
              <div className="h-5 bg-stone-200 rounded w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 18. ADMIN DASHBOARD SKELETON — matches the admin page layout
export function AdminSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-bronze/20 shadow-xl space-y-8 animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div>
        <div className="h-6 bg-ink/25 rounded w-64" />
        <div className="h-3 bg-stone-300 rounded w-80 mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-stone-100 space-y-2">
            <div className="flex justify-between">
              <div className="h-2.5 bg-stone-300 rounded w-16" />
              <div className="w-4 h-4 rounded bg-bronze/10" />
            </div>
            <div className="h-5 bg-ink/20 rounded w-20" />
            <div className="h-2.5 bg-stone-200 rounded w-12" />
          </div>
        ))}
      </div>
      <div className="p-5 border border-ink/10 rounded-xl space-y-4">
        <div className="h-3 bg-ink/20 rounded w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between">
              <div className="h-2.5 bg-stone-300 rounded w-1/2" />
              <div className="h-2.5 bg-stone-300 rounded w-20" />
            </div>
            <div className="h-2.5 bg-stone-200 rounded-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 19. PEOPLE LIST SKELETON — matches the people/biographies grid
export function PeopleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6 w-full animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-7 bg-ink/25 rounded w-40" />
        <div className="h-9 bg-stone-200 rounded-xl w-full sm:w-72" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4 relative overflow-hidden">
            <div className="space-y-2">
              <div className="h-5 bg-ink/25 rounded w-2/3" />
              <div className="space-y-2 pt-2">
                <div className="h-2.5 bg-stone-200 rounded w-full" />
                <div className="h-2.5 bg-stone-200 rounded w-11/12" />
                <div className="h-2.5 bg-stone-200 rounded w-4/5" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-stone-100">
              <div className="h-3 bg-stone-200/75 rounded w-20" />
              <div className="h-8 bg-ink/15 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 20. PHOTO GALLERY PAGE SKELETON — matches the photos page layout
export function PhotoPageSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-7 bg-ink/25 rounded w-48" />
        <div className="h-9 bg-stone-200 rounded-xl w-full sm:w-72" />
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <div className="h-48 w-full bg-stone-200/50" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-ink/25 rounded w-1/2" />
              <div className="h-3 bg-bronze/10 rounded w-1/3" />
              <div className="h-3 bg-stone-200 rounded w-full" />
              <div className="flex justify-between items-center border-t border-stone-100 pt-3">
                <div className="h-3 bg-stone-200 rounded w-20" />
                <div className="h-3 bg-bronze/20 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 21. DOCUMENTS PAGE SKELETON — matches the documents page layout
export function DocPageSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-6 w-full animate-pulse relative overflow-hidden" aria-busy="true">
      <Shimmer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-7 bg-ink/25 rounded w-48" />
        <div className="h-9 bg-stone-200 rounded-xl w-full sm:w-72" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-5 border border-stone-200 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-bronze/10 shrink-0" />
            <div className="space-y-2 flex-grow">
              <div className="space-y-1">
                <div className="h-4 bg-ink/25 rounded w-1/2" />
                <div className="h-2.5 bg-stone-300 rounded w-1/3" />
              </div>
              <div className="h-3 bg-stone-200 rounded w-11/12" />
              <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                <div className="h-2.5 bg-bronze/20 rounded w-1/3" />
                <div className="h-3 bg-ink/15 rounded w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 22. AUTHENTICATION SCREENS SKELETON (Prevent initial CLS on Login/Register)
export function AuthSkeleton() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#F5F0E8] overflow-hidden select-none animate-pulse" aria-busy="true">
      <Shimmer />
      
      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10 relative">
        <div className="h-4 bg-[#1A1A2E]/20 rounded w-16" />
        <div className="hidden sm:flex items-center gap-8">
          <div className="h-3 bg-[#1A1A2E]/15 rounded w-14" />
          <div className="h-3 bg-[#1A1A2E]/15 rounded w-14" />
          <div className="h-3 bg-[#1A1A2E]/15 rounded w-14" />
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-grow flex items-center justify-center py-10 px-6 z-10 relative">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#C4956A]/20 shadow-2xl p-8 sm:p-10 relative overflow-hidden flex flex-col items-center">
          {/* Logo element */}
          <div className="w-16 h-16 rounded-full bg-stone-200/60 mb-4 animate-pulse" />
          {/* Title */}
          <div className="h-5 bg-[#1A1A2E]/25 rounded w-1/2 mb-2 animate-pulse" />
          <div className="h-3.5 bg-stone-300 rounded w-2/3 mb-8 animate-pulse" />

          {/* Form input fields mockups */}
          <div className="w-full space-y-4">
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-300 rounded w-1/4" />
              <div className="h-11 bg-stone-550 rounded-xl w-full border border-stone-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-stone-300 rounded w-1/4" />
              <div className="h-11 bg-stone-550 rounded-xl w-full border border-stone-200" />
            </div>
            
            <div className="h-12 bg-[#C4956A]/20 rounded-full w-full mt-6" />
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="w-full py-8 border-t border-[#C4956A]/10 z-10 relative bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="h-3 bg-[#1A1A2E]/20 rounded w-64" />
          <div className="flex gap-4">
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-16" />
            <div className="h-3 bg-[#1A1A2E]/20 rounded w-12" />
          </div>
        </div>
      </footer>
    </div>
  );
}
