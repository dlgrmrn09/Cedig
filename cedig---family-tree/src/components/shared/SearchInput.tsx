"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Хайх...",
  className = "",
  loading = false,
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-3.5 h-3.5 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-vellum border border-ink/15 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-bronze transition-colors"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-bronze/30 border-t-bronze animate-spin" />
        </div>
      )}
    </div>
  );
}
