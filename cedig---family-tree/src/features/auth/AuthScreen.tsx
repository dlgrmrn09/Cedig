'use client';

import { AuthScreenContent } from './AuthScreenContent';

import type { ViewType } from '@/src/types/common';

export default function AuthScreen({ initialViewMode = 'login' }: { initialViewMode?: ViewType }) {
  return (
    <div className="min-h-screen">
      <AuthScreenContent initialViewMode={initialViewMode} />
    </div>
  );
}