import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface Props {
  token: string;
  bookingId: string;
  lenderId: string;
}

interface AcceptRejectType {
  bookingId: string;
  lenderId: string;
  action: string;
}

const AcceptRejectButton = ({ token, bookingId, lenderId }: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["accept-reject"],
    mutationFn: async (payload: AcceptRejectType) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/accept-reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Operation successful");
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const handleAccept = async () => {
    try {
      const data = {
        bookingId,
        lenderId,
        action: "accept",
      };
      await mutateAsync(data);
    } catch (error) {
      console.log(`error : ${error}`);
    }
  };

  const handleReject = async () => {
    try {
      const data = {
        bookingId,
        lenderId,
        action: "reject",
      };
      await mutateAsync(data);
    } catch (error) {
      console.log(`error : ${error}`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Button
        onClick={handleAccept}
        disabled={isPending}
        className="w-full h-9 text-xs py-1"
      >
        {isPending ? "Accept" : "Accept"}
      </Button>

      <Button
        onClick={handleReject}
        disabled={isPending}
        variant="outline"
        className="w-full h-9 text-xs py-1 border-gray-300"
      >
        {isPending ? "Reject" : "Reject"}
      </Button>
    </div>
  );
};

export default AcceptRejectButton;
