"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface UseUrlSearchOptions {
  paramKey?: string;
  pageParamKey?: string;
  delay?: number;
  defaultPage?: number;
}

export function useUrlSearch(options: UseUrlSearchOptions = {}) {
  const { paramKey = "q", pageParamKey = "page", delay = 400, defaultPage = 1 } = options;

  const getInitialQuery = () => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get(paramKey) || "";
  };

  const getInitialPage = () => {
    if (typeof window === "undefined") return defaultPage;
    const p = parseInt(new URLSearchParams(window.location.search).get(pageParamKey) || "", 10);
    return isNaN(p) ? defaultPage : p;
  };

  const [query, setQueryInternal] = useState(getInitialQuery);
  const debouncedQuery = useDebounce(query, delay);
  const [page, setPageInternal] = useState(getInitialPage);

  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery);
    setPageInternal(1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (debouncedQuery) {
      url.searchParams.set(paramKey, debouncedQuery);
    } else {
      url.searchParams.delete(paramKey);
    }
    if (page > 1) {
      url.searchParams.set(pageParamKey, String(page));
    } else {
      url.searchParams.delete(pageParamKey);
    }
    window.history.replaceState({}, "", url.toString());
  }, [debouncedQuery, page, paramKey, pageParamKey]);

  const setPage = useCallback((newPage: number) => {
    setPageInternal(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return { query, setQuery, debouncedQuery, page, setPage };
}
