"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { escalateFormSchema } from "@/schemas/escalateFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormValues = z.input<typeof escalateFormSchema>;

interface EscalateData {
  reason: string;
  description: string;
  priority: string;
  confirmed: boolean;
  scheduleCall: boolean;
  evidence: Array<{
    filename: string;
    url: string;
  }>;
}

const EscalateForm = () => {
  const { id } = useParams();
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(escalateFormSchema),
    defaultValues: {
      reason: "",
      description: "",
      priority: "Low",
      evidence: [],
    },
  });

  const escalateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/${id}/escalate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to escalate dispute");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Escalation successful:", data);
      const message = data?.message || data?.data?.message || "Dispute escalated successfully!";
      toast.success(message);
      form.reset();
      setImage(null);
    },
    onError: (error: Error) => {
      console.error("Escalation failed:", error);
      toast.error(error.message || "Failed to escalate dispute");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!id) {
      toast.error("Dispute ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("reason", values.reason);
    formData.append("description", values.description);
    formData.append("priority", values.priority);
    // FormData sends everything as strings. 
    // We send them as strings, backend must handle the conversion or use these string values.
    formData.append("confirmed", "true");
    formData.append("scheduleCall", "true");

    if (image) {
      formData.append("filename", image);
    }

    escalateMutation.mutate(formData);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white p-6 rounded-lg space-y-5 shadow-[0px_4px_10px_0px_#0000001A]">
            <h1 className="text-xl font-medium mb-5">Escalation Details</h1>

            {/* reason field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Escalation *</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Write your reason"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>

                  <FormControl>
                    <Textarea
                      className="h-[150px]"
                      placeholder="Write your reason"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* evidence field */}
            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Evidence</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-[60px]"
                        value={image ? image.name : ""}
                        placeholder="File name"
                        readOnly
                      />

                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="evidence-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImage(file);
                              field.onChange([
                                {
                                  filename: file.name,
                                  url: URL.createObjectURL(file),
                                },
                              ]);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("evidence-upload")?.click()
                          }
                          className="absolute right-4 top-[16%]"
                        >
                          Upload File
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* priority field */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Label *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-5 border bg-background px-3 py-2 text-base h-12 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Low" id="Low" />
                        <Label htmlFor="Low">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Medium" id="Medium" />
                        <Label htmlFor="Medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="High" id="High" />
                        <Label htmlFor="High">High</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
              <h1 className="text-xl font-medium text-gray-900 mb-6">
                Actions
              </h1>

              <div className="flex items-center gap-5">
                <Button disabled={escalateMutation.isPending} type="submit">
                  {escalateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Escalate Dispute
                    </div>
                  ) : (
                    "Escalate Dispute"
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EscalateForm;