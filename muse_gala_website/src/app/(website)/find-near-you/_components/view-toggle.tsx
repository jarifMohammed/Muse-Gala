"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List } from "lucide-react";

export default function ViewToggle() {
  const pathname = usePathname();
  const isMapView = pathname === "/find-near-you/map";
  const isListView = pathname === "/find-near-you/list";

  return (
    <div className="flex justify-center gap-1.5 md:gap-2 brand-body text-black uppercase">
      <Link
        href="/find-near-you/list"
        className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-5 py-1.5 md:py-2 border transition-all text-[10px] md:text-sm tracking-widest h-7 md:h-10 uppercase ${isListView
          ? "bg-black text-white border-black"
          : "bg-transparent text-black border-black/20 hover:border-black"
          }`}
      >
        <List size={12} className="md:size-4" />
        LIST
      </Link>
      <Link
        href="/find-near-you/map"
        className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-5 py-1.5 md:py-2 border transition-all text-[10px] md:text-sm tracking-widest h-7 md:h-10 uppercase ${isMapView
          ? "bg-black text-white border-black"
          : "bg-transparent text-black border-black/20 hover:border-black"
          }`}
      >
        <Map size={12} className="md:size-4" />
        MAP
      </Link>
    </div>
  );
}
