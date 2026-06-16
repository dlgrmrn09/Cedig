"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 10;

export function useTabUrlState(tabPrefix: string) {
  const qKey = `${tabPrefix}_q`;
  const pKey = `${tabPrefix}_page`;

  const getInitialQuery = () => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get(qKey) || "";
  };

  const getInitialPage = () => {
    if (typeof window === "undefined") return 1;
    const p = parseInt(new URLSearchParams(window.location.search).get(pKey) || "1", 10);
    return isNaN(p) ? 1 : p;
  };

  const [query, setQuery] = useState(getInitialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const [page, setPageInternal] = useState(getInitialPage);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedQuery) {
      url.searchParams.set(qKey, debouncedQuery);
    } else {
      url.searchParams.delete(qKey);
      url.searchParams.delete(pKey);
    }
    if (page > 1) {
      url.searchParams.set(pKey, String(page));
    } else {
      url.searchParams.delete(pKey);
    }
    window.history.replaceState({}, "", url.toString());
  }, [debouncedQuery, page, qKey, pKey]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPageInternal(1);
  }, []);

  const setPage = useCallback((p: number) => {
    setPageInternal(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return { query, setQuery: handleQueryChange, debouncedQuery, page, setPage };
}

export function usePaginatedData<T>(data: T[], page: number, pageSize: number = PAGE_SIZE) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      paginatedData: data.slice(start, start + pageSize),
      totalPages,
      totalItems: data.length,
    };
  }, [data, page, pageSize]);
}
