"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}{' '}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '0px',
            padding: '20px 24px',
            fontFamily: 'var(--font-avenir)',
          },
          className: 'shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none',
          classNames: {
            toast: 'group bg-white !rounded-none border-l-4 flex items-start gap-4',
            success: 'border-l-black text-black',
            error: 'border-l-[#891D33] text-black',
            info: 'border-l-blue-500 text-black',
            title: 'text-[13px] font-bold tracking-[3px] uppercase leading-tight',
            description: 'text-[11px] text-gray-500 tracking-wider mt-1 leading-relaxed',
          },
        }}
      />
      <NextTopLoader color="#891D33" showSpinner={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
