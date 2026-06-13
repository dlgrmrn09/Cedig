import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating the state until after a specified delay time has elapsed.
 * Useful for debouncing search queries, user inputs, or window resizing events.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
