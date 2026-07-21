"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Listing } from "@/types/listings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  reasonsForRejection: z.string(),
});

interface Props {
  accessToken: string;
  data?: Listing;
  onClose: () => void;
}

export default function ListingRejectionForm({
  accessToken,
  data,
  onClose,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending: isRejecting } = useMutation({
    mutationKey: ["rejecting"],
    mutationFn: (reqBody: {
      approvalStatus: Listing["approvalStatus"];
      reasonsForRejection?: string;
    }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/${data?._id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reqBody),
        }
      ).then((res) => res.json()),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message);
        return;
      }

      toast.success("Listing is rejected");
      queryClient.invalidateQueries({ queryKey: ["listing", data?._id] });
      onClose();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      reasonsForRejection: values.reasonsForRejection,
      approvalStatus: "rejected",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="reasonsForRejection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Submit your reason"
                  {...field}
                  className="min-h-[150px]"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-end">
          <Button type="submit" effect="gooeyRight" disabled={isRejecting}>
            Submit {isRejecting && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
