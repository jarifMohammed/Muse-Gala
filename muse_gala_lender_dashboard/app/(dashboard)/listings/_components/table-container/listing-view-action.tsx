import AlertModal from "@/components/ui/custom/alert-modal";
import { Button } from "@/components/ui/button";
import { Listing } from "@/types/listings/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { Trash, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  data: Listing;
  table: Table<Listing>;
}

const ListingViewAction = ({ data, table }: Props) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const queryClient = useQueryClient();
  const token = (table.options.meta as any)?.token;

  const { mutate: deleteListing, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${data._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to delete listing");
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Listing deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["lender-all-listing"] });
      setIsAlertOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-neutral-500 hover:text-primary hover:bg-primary/5"
              asChild
            >
              <Link href={`/listings/${data._id}`} prefetch={false}>
                <MoreHorizontal className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs font-medium">View Listing</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-neutral-500 hover:text-rose-600 hover:bg-rose-50"
              onClick={() => setIsAlertOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs font-medium">Delete Listing</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertModal
        isOpen={isAlertOpen}
        loading={isDeleting}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => deleteListing()}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
      />
    </div>
  );
};

export default ListingViewAction;
