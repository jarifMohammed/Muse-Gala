"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LenderProfile } from "@/types/lender";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  data: LenderProfile;
}

const formSchema = z.object({
  status: z.string(),
  reason: z.string().optional(),
});

const StatusTab = ({ data }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: data.status,
      reason: "",
    },
  });

  const queryClient = useQueryClient();
  const cu = useSession();
  const accessToken = cu?.data?.user?.accessToken || "";

  const { isPending: isResendPending, mutate: resendPassword } = useMutation({
    mutationKey: ["resend-password", data._id],
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/application/${data._id}/resend-password`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((res) => res.json()),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { isPending, mutate } = useMutation({
    mutationKey: ["status-update", data._id],
    mutationFn: (body: z.infer<typeof formSchema>) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/application/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        }
      ).then((res) => res.json()),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message);
        return;
      }

      // success message
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["lenders"] });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none rounded-[6px]">
        <CardHeader>
          <CardTitle className="font-light">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] font-light space-y-2">
          <div className="space-y-2">
            <p>Current Status: {data.status}</p>
            <p>Last Updated: {moment(data.updatedAt).format("MMM DD, YYYY")}</p>
          </div>
          <div className="pt-2">
            <Button
              type="button"
              className="bg-black text-white hover:bg-black/90"
              size="sm"
              onClick={() => resendPassword()}
              disabled={isResendPending}
            >
              {isResendPending ? "Sending..." : "Resend Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none rounded-[6px]">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 pt-5"
            >
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-normal">
                      Update Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder=""
                            className="text-[12px] font-light"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-normal">
                      Reason for Change
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="write reason..."
                        className="resize-none text-[10px] font-light min-h-[150px]"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-end">
                <Button type="submit" disabled={isPending}>
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusTab;
