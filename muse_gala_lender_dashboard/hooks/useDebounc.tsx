import { useEffect, useState } from "react";

/**
 * useDebounce hook
 * Delays updating the value until after the specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
