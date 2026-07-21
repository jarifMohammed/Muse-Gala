"use client";

import { Suspense, type ReactNode } from "react";

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that provides a Suspense boundary for components
 * that use React.use() to unwrap promises
 */
export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className="p-8 flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#891d33]"></div>
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
