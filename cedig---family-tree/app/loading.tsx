'use client';

import React from 'react';
import { FullPageSkeleton } from '@/src/components/SkeletonLoader';

/**
 * Standard Next.js 15 root loading fallback route structure
 */
export default function RootLoading() {
  return <FullPageSkeleton />;
}
