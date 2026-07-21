"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { signOut } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div>
        <div className="flex flex-col min-h-screen ">
          <div>
            {/* Sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-[208px] bg-[#891d33] text-white flex flex-col z-10">
              <div className="p-8 flex justify-center">
                <div className="text-white text-7xl font-serif italic">𝓜</div>
              </div>

              <nav className="flex flex-col px-6 py-4 space-y-1">
                <Link
                  href="/"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/") ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/bookings")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Bookings
                </Link>
                <Link
                  href="/dashboard/listings"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/listings")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Listings
                </Link>
                <Link
                  href="/dashboard/payments"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/payments")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Payments
                </Link>
                <Link
                  href="/dashboard/disputes"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/disputes")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Disputes
                </Link>
                <Link
                  href="/dashboard/chats"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/chats")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Chats
                </Link>
                <Link
                  href="/dashboard/help-center"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/help-center")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Help Center
                </Link>
                <Link
                  href="/dashboard/account-settings"
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/account-settings")
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                    }`}
                >
                  Account Settings
                </Link>
              </nav>

              <div className="mt-auto p-6 flex flex-col  justify-center ">
                <button
                  onClick={() => signOut({ redirectTo: "/sign-in" })}
                  className="text-xs uppercase tracking-wider pb-3 pt-4 w-full text-left font-medium"
                >
                  SIGN OUT
                </button>
                <hr />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
              {/* Main content */}
              <main className="flex-1 bg-[#fefaf6] overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
