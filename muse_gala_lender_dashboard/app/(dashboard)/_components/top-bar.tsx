"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "./sidebar-content";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import { useUserStore } from "@/zustand/useUserStore";

interface Props {
  token: string;
  userID: string;
}

const Topbar = ({ token, userID }: Props) => {
  const { user: userStore } = useUserStore();
  const { data: userInfo, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ["user-info", userID],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data; // Return the whole object to check nesting
    },
    enabled: !!userID && !!token,
  });

  // Resilient name extraction
  const getProfileData = () => {
    // 1. Check nested data.data.user
    if (userInfo?.data?.user) return userInfo.data.user;
    // 2. Check data.user
    if (userInfo?.user) return userInfo.user;
    // 3. Check data.data
    if (userInfo?.data) return userInfo.data;
    // 4. Case where data is the user object itself
    if (userInfo?.firstName || userInfo?.email) return userInfo;

    return null;
  };

  const profile = getProfileData();

  const firstName = profile?.firstName || userStore?.firstName || "";
  const lastName = profile?.lastName || userStore?.lastName || "";
  const displayName = profile?.fullName || profile?.FullName || profile?.fullName || `${firstName} ${lastName}`.trim();

  const getInitials = () => {
    if (firstName || lastName) {
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
      return `${firstInitial}${lastInitial}` || "U";
    }
    if (displayName && displayName !== "U" && displayName !== "Loading") {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
      }
      return parts[0].charAt(0).toUpperCase();
    }
    return "U";
  };

  const initials = getInitials();
  const fullName = displayName || (isQueryLoading ? "Loading" : "U");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6 w-full max-w-full">
      <div className="grid grid-cols-3 items-center w-full max-w-full overflow-hidden">
        {/* Left: Hamburger (Mobile) / User Name (Desktop) */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] max-w-[80vw]">
              <SidebarContent onClose={() => { }} token={token} userID={userID} />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold truncate max-w-[200px]">{fullName}</h1>
            <p className="text-sm text-muted-foreground">Lender Dashboard</p>
          </div>
        </div>

        {/* Middle: Logo & Text (Mobile Only) */}
        <div className="lg:hidden flex items-center justify-center gap-2">
          <div className="relative h-7 w-9 flex-shrink-0">
            <Image src="/images/auth-logo.png" alt="logo" fill className="object-contain" />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap uppercase tracking-wider hidden sm:block">Dashboard</span>
        </div>

        {/* Right: Profile Initials */}
        <div className="flex lg:hidden items-center justify-end gap-1 md:gap-4">
          <Link href="/account-settings">
            <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-[#54051d] text-white text-xs md:text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
