"use client";

import { Button } from "@/components/ui/button";
import {
    BarChart3,
    DollarSign,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
    Users,
    Video,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/zustand/useUserStore";

const routes = [
    {
        id: 1,
        label: "Overview",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        id: 2,
        label: "Bookings",
        icon: Users,
        href: "/bookings",
    },
    {
        id: 3,
        label: "Listings",
        icon: FileText,
        href: "/listings",
    },
    {
        id: 4,
        label: "Payments",
        icon: ShoppingBag,
        href: "/payments",
    },
    {
        id: 5,
        label: "Subscription Plans",
        icon: ShoppingBag,
        href: "/subscription-plans",
    },
    {
        id: 6,
        label: "Disputes",
        icon: Video,
        href: "/disputes",
    },
    {
        id: 7,
        label: "Chats",
        icon: DollarSign,
        href: "/chats",
    },
    {
        id: 8,
        label: "Help Center",
        icon: BarChart3,
        href: "/help-center",
    },
    {
        id: 9,
        label: "Account Settings",
        icon: Settings,
        href: "/account-settings",
    },
];

interface SidebarContentProps {
    onClose?: () => void;
    token?: string;
    userID?: string;
}

const SidebarContent = ({ onClose, token, userID }: SidebarContentProps) => {
    const pathname = usePathname();
    const { user: userStore } = useUserStore();

    const { data: userInfo, isLoading: isQueryLoading } = useQuery({
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
            return data;
        },
        enabled: !!userID && !!token,
    });

    const getProfileData = () => {
        if (userInfo?.data?.user) return userInfo.data.user;
        if (userInfo?.user) return userInfo.user;
        if (userInfo?.data) return userInfo.data;
        if (userInfo?.firstName || userInfo?.email) return userInfo;
        return null;
    };

    const profile = getProfileData();
    const firstName = profile?.firstName || userStore?.firstName || "";
    const lastName = profile?.lastName || userStore?.lastName || "";
    const displayName = profile?.fullName || profile?.FullName || `${firstName} ${lastName}`.trim();

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
        <div className="flex h-full flex-col bg-[#54051d]">
            {/* Logo */}
            <div className="border-none p-6 flex justify-center items-center">
                <div className="relative h-[80px] w-[80px]">
                    <Image src="/Logo.svg" alt="logo" fill />
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-hidden p-3">
                <ul className="space-y-2">
                    {routes.map((route) => {
                        const isActive =
                            route.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(route.href);

                        return (
                            <li key={route.id}>
                                <Link
                                    href={route.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex text-white/80 items-center gap-3 rounded-md px-3 py-2",
                                        isActive
                                            ? "bg-white/20 text-primary-foreground"
                                            : " hover:bg-white/30 hover:text-white/70"
                                    )}
                                >
                                    <span>{route.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Profile & Logout Section */}
            <div className="p-3 space-y-2">
                {/* Desktop Profile Section */}
                <div className="hidden lg:block px-3 py-2 mb-2">
                    <Link
                        href="/account-settings"
                        onClick={onClose}
                        className="flex items-center gap-3 group"
                    >
                        <Avatar className="h-9 w-9 border border-white/20 group-hover:opacity-80 transition-opacity">
                            <AvatarFallback className="bg-white/20 text-white text-sm font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white truncate">
                                {fullName}
                            </span>
                            <span className="text-xs text-white/50 truncate">
                                View Profile
                            </span>
                        </div>
                    </Link>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border-none">
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to sign out?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be logged out of your account and redirected to the
                                sign-in page. You can sign back in at any time.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    await signOut({ redirectTo: "/sign-in", redirect: true });
                                }}
                            >
                                Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default SidebarContent;
