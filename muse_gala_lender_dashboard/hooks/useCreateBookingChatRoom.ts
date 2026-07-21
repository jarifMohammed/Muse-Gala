"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateBookingChatRoomOptions {
  accessToken?: string;
}

interface CreateBookingChatRoomPayload {
  bookingId: string;
}

export const useCreateBookingChatRoom = (
  options: CreateBookingChatRoomOptions = {}
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const accessToken = options.accessToken || session?.user?.accessToken || "";

  return useMutation({
    mutationFn: async ({ bookingId }: CreateBookingChatRoomPayload) => {
      if (!bookingId) {
        throw new Error("Booking id is required");
      }

      if (!accessToken) {
        throw new Error("You must be signed in to message this customer");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/chatrooms/create-for-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to open chat");
      }

      const roomId =
        typeof json.data === "string" ? json.data : json.data?._id;

      if (!roomId) {
        throw new Error("Chat room id was not returned");
      }

      return roomId as string;
    },
    onSuccess: (roomId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/chats?id=${roomId}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to open chat"
      );
    },
  });
};
