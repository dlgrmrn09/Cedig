"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ERROR BOUNDARY]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-vellum">
      <div className="text-center space-y-4 max-w-md px-6">
        <h2 className="text-xl font-bold text-ink">Алдаа гарлаа</h2>
        <p className="text-sm text-ink/60">
          Түр тасалдал гарлаа. Дахин оролдоно уу.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-pine text-white rounded-xl font-semibold text-sm hover:opacity-90 transition cursor-pointer"
        >
          Дахин оролдох
        </button>
      </div>
    </div>
  );
}
