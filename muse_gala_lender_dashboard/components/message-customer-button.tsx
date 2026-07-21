"use client";

import { Button } from "@/components/ui/button";
import { useCreateBookingChatRoom } from "@/hooks/useCreateBookingChatRoom";
import { cn } from "@/lib/utils";
import { Loader2, MessageCircle } from "lucide-react";

interface MessageCustomerButtonProps {
  bookingId?: string;
  accessToken?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  iconOnly?: boolean;
}

const MessageCustomerButton = ({
  bookingId,
  accessToken,
  className,
  variant = "outline",
  size = "sm",
  label = "Message customer",
  iconOnly = false,
}: MessageCustomerButtonProps) => {
  const { mutate: openChat, isPending } = useCreateBookingChatRoom({
    accessToken,
  });

  const handleClick = () => {
    if (!bookingId || isPending) return;
    openChat({ bookingId });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      className={cn(iconOnly ? "h-8 w-8" : "", className)}
      onClick={handleClick}
      disabled={!bookingId || isPending}
      aria-label={label}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      {!iconOnly && <span>{label}</span>}
    </Button>
  );
};

export default MessageCustomerButton;
