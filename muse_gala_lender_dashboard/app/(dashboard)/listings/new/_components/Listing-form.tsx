"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Listing,
  ListingFormValues,
  listingSchema,
} from "@/types/listings/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MoveLeft } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BasicDetailsForm from "./basic-details";
import DescriptionAndDetailsForm from "./description-and-details-form";
import MediaForm from "./media-form";
import PricingAndFeesForm from "./pricing-and-fees-form";

interface Props {
  token: string;
  initialId?: string;
}

interface ApiProps {
  status: boolean;
  message: string;
  data: Listing;
}

async function getListing(initialId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${initialId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // avoid caching if data is dynamic
    }
  );

  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export default function ListingForm({ token, initialId }: Props) {
  const router = useRouter();
  /** Holds the custom text typed when "Other" category is selected */
  const otherCategoryRef = useRef<string>("");

  const { data, isLoading } = useQuery<ApiProps>({
    queryKey: ["listing", initialId],
    queryFn: () => getListing(initialId!, token),
    enabled: !!initialId,
  });

  const { mutate: createListing, isPending } = useMutation({
    mutationKey: ["listing-create"],
    mutationFn: (reqBody: ListingFormValues) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      }).then((res) => res.json()),
    onSuccess: (data: ApiProps) => {
      if (!data.status) {
        toast.error(data.message);
        return;
      }

      // ✅ Success toast with dressName
      const dressName = data?.data?.dressName || "your dress";
      toast.success("Successfully listed", {
        description: `Your dress "${dressName}" has been added to your listings.`,
      });
      form.reset(
        {
          dressName: "",
          brand: "",
          size: [], // default sizes
          colour: [], // default colours
          condition: "Like New", // default condition
          category: [], // default categories
          description: "",
          material: "",

          rentalPrice: {
            fourDays: 0,
            eightDays: 0,
          },
          media: [],
          pickupOption: "Local-Pickup", // default pickup option
        },
        { keepValues: false } // ensures all values are replaced with these defaults
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: editListing, isPending: isUpdating } = useMutation({
    mutationKey: ["listing-create"],
    mutationFn: (
      reqBody: ListingFormValues & {
        approvalStatus: "pending" | "approved" | "rejected";
        isActive: boolean;
      }
    ) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${initialId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reqBody),
        }
      ).then((res) => res.json()),
    onSuccess: (data: ApiProps) => {
      if (!data.status) {
        toast.error(data.message);
        return;
      }

      // ✅ Success toast for update
      const dressName = data?.data?.dressName || "your dress";
      toast.success("Listing updated", {
        description: `Your dress "${dressName}" has been updated successfully.`,
      });
      form.reset(
        {
          dressName: "",
          brand: "",
          size: [], // default sizes
          colour: [], // default colours
          condition: "Like New", // default condition
          category: [], // default categories
          description: "",
          material: "",

          rentalPrice: {
            fourDays: 0,
            eightDays: 0,
          },
          media: [],
          pickupOption: "Local-Pickup", // default pickup option
        },
        { keepValues: false } // ensures all values are replaced with these defaults
      );
      router.back();
    },

    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating the listing."
      );
    },
  });

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      dressName: data?.data.dressName ?? "",
      brand: data?.data.brand ?? "",
      size: data?.data.size ?? [],
      colour: data?.data.colour ?? [],
      condition: data?.data.condition ?? undefined,
      category: data?.data.category ?? [],
      description: data?.data.description ?? "",
      material: data?.data.material ?? "",

      rentalPrice: {
        fourDays: data?.data.rentalPrice?.fourDays ?? 0,
        eightDays: data?.data.rentalPrice?.eightDays ?? 0,
      },
      media: data?.data.media ?? [],
      pickupOption: data?.data.pickupOption ?? undefined,
    },
  });

  function onSubmit(values: ListingFormValues) {
    // If "Other" is in the category array, replace it with the custom typed value
    const customCat = otherCategoryRef.current.trim();
    const finalValues: ListingFormValues = {
      ...values,
      category: (customCat && values.category.includes("Other")
        ? [...new Set(values.category.map((c) => (c === "Other" ? customCat : c)))]
        : values.category) as ListingFormValues["category"],
    };

    if (initialId) {
      editListing({
        ...finalValues,
        approvalStatus: "pending",
        isActive: false,
      });
    } else {
      createListing(finalValues);
    }
  }

  const loading = isPending || isLoading || isUpdating;

  return (
    <Card className="p-0 sm:p-5 border-0 bg-transparent sm:bg-white space-y-4 sm:space-y-6">
      <CardHeader className="p-0 px-2 sm:px-0">
        <Button
          className="w-fit"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
          onClick={() => router.back()}
        >
          Back Now
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className=" space-y-6"
          >
            <Card className="shadow-none border border-neutral-200 sm:border-0 rounded-xl sm:rounded-none">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-neutral-100 sm:border-b-0">
                <CardTitle className="text-lg sm:text-2xl">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-5 sm:px-6 sm:py-0">
                <BasicDetailsForm form={form} otherCategoryRef={otherCategoryRef} />
              </CardContent>
            </Card>
            <Card className="shadow-none border border-neutral-200 sm:border-0 rounded-xl sm:rounded-none">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-neutral-100 sm:border-b-0">
                <CardTitle className="text-lg sm:text-2xl">Media</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-5 sm:px-6 sm:py-0">
                <MediaForm form={form} />
              </CardContent>
            </Card>
            <Card className="shadow-none border border-neutral-200 sm:border-0 rounded-xl sm:rounded-none">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-neutral-100 sm:border-b-0">
                <CardTitle className="text-lg sm:text-2xl">Price & Fees</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Note: This listing price is inclusive of dry-cleaning fees.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-5 sm:px-6 sm:py-0">
                <PricingAndFeesForm form={form} />
              </CardContent>
            </Card>
            <Card className="shadow-none border border-neutral-200 sm:border-0 rounded-xl sm:rounded-none">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-neutral-100 sm:border-b-0">
                <CardTitle className="text-lg sm:text-2xl">Description & Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-5 sm:px-6 sm:py-0">
                <DescriptionAndDetailsForm form={form} />
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 pb-8 sm:pb-0 px-2 sm:px-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-auto font-medium"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" effect="shineHover" className="w-full sm:w-auto h-12 sm:h-auto font-medium" disabled={loading}>
                {initialId ? "Save Listing" : "Create Listing"}
                {loading && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
