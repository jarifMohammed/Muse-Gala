"use client"

import { useRef, useCallback, type DependencyList } from "react"

// A hook that returns a memoized callback that only changes if one of the dependencies changes
// and also checks deep equality of objects
export function useDeepCallback<T extends (...args: any[]) => any>(callback: T, dependencies: DependencyList): T {
  const ref = useRef<T>(callback)

  // Simple deep equality check for objects
  const areDepsEqual = (prev: any[], next: any[]): boolean => {
    if (prev.length !== next.length) return false

    for (let i = 0; i < prev.length; i++) {
      const p = prev[i]
      const n = next[i]

      if (p === n) continue

      if (typeof p === "object" && p !== null && typeof n === "object" && n !== null) {
        // Compare object keys
        const pKeys = Object.keys(p)
        const nKeys = Object.keys(n)

        if (pKeys.length !== nKeys.length) return false

        for (const key of pKeys) {
          if (!n.hasOwnProperty(key) || p[key] !== n[key]) {
            return false
          }
        }
      } else {
        return false
      }
    }

    return true
  }

  // Only update the callback if dependencies have changed
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args)
  }, dependencies) as T
}

// A utility to memoize expensive calculations
export function memoize<T extends (...args: any[]) => any>(fn: T, resolver?: (...args: Parameters<T>) => string): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
