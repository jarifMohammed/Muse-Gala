import { cn } from "@/lib/utils";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
}

// Memoize the StatCard component to prevent re-renders if props don't change
export const StatCard = memo(function StatCard({
  title,
  value,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-3 md:p-4 pb-1 md:pb-1 text-center">
        <CardTitle className="text-[14px] md:text-[16px] font-medium leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0 md:pt-0 text-center">
        <p className="text-lg md:text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
});
