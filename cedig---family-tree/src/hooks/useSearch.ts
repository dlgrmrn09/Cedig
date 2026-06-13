import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "../../hooks/use-debounce";
import { DEBOUNCE_DELAY_MS } from "@/src/constants";

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  delay?: number;
}

export function useSearch<T>({ data, searchFields, delay = DEBOUNCE_DELAY_MS }: UseSearchOptions<T>) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, delay);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return data;
    const lower = debouncedQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        return String(val ?? "").toLowerCase().includes(lower);
      }),
    );
  }, [data, debouncedQuery, searchFields]);

  const reset = useCallback(() => setQuery(""), []);

  return { query, setQuery, debouncedQuery, results, reset };
}
