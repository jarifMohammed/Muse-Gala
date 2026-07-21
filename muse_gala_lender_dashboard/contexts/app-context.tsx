"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

type AppContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  bookingsCount: number;
  setBookingsCount: (count: number) => void;
  listingsCount: number;
  setListingsCount: (count: number) => void;
  user: any | null;
  setUser: (user: any) => void;
  refetchData: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [listingsCount, setListingsCount] = useState(0);
  const [user, setUser] = useState(null);

  // This function would be used to refresh all data
  const refetchData = useCallback(() => {
    // This would fetch all global data needed across components
    console.log("Refetching global data...");
  }, []);

  // Run initial data fetch
  useEffect(() => {
    refetchData();
  }, [refetchData]);

  // Memoize context value to prevent unnecessary renders
  const contextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      bookingsCount,
      setBookingsCount,
      listingsCount,
      setListingsCount,
      user,
      setUser,
      refetchData,
    }),
    [isLoading, bookingsCount, listingsCount, user, refetchData]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
