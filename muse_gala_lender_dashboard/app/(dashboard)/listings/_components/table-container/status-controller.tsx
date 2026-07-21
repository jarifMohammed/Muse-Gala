import { Switch } from "@/components/ui/switch";
import { Listing } from "@/types/listings/index";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Listing;
}

const StatusController = ({ data }: Props) => {
  const { status, data: session } = useSession();
  const editable = data.approvalStatus === "approved";

  // keep local state in sync with API value
  const [enabled, setEnabled] = useState<boolean>(data.isActive);

  useEffect(() => {
    setEnabled(data.isActive);
  }, [data.isActive]);

  const token = session?.user?.accessToken;

  const { mutate, isPending } = useMutation({
    mutationKey: ["listing-status", data._id],
    mutationFn: async (isActive: boolean) => {
      if (!token) throw new Error("Unauthorized: No access token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to update status");
      }

      return res.json();
    },
    onSuccess: (res) => {
      toast.success(enabled ? "Available" : "Unavailable", {
        description: `${data.dressName} is now ${
          res.isActive ? "available" : "unavailable"
        } on the Musa Gala platform.`,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error("Update Failed", {
        description: `Failed to update ${
          data.dressName
        } on the Musa Gala platform: ${
          error.message || "Something went wrong"
        }`,
      });
    },
  });

  if (status === "loading") return null;

  return (
    <div>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) => {
          setEnabled(checked); // optimistic update
          mutate(checked);
        }}
        disabled={!editable || isPending}
      />
    </div>
  );
};

export default StatusController;
