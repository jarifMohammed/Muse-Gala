"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ListingFormValues } from "@/types/listings/index";
import { FileText, Package, Truck } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ListingFormValues>;
}

const DescriptionAndDetailsForm = ({ form }: Props) => {
  return (
    <div className="space-y-8">
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the dress (style, fit, special details)"
                className="resize-none min-h-[120px] bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:ring-0 transition-all duration-200 shadow-sm"
                rows={5}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <div className="text-[10px] text-neutral-400 text-right pr-1">
              {(field.value?.length ?? 0)} / 1000
            </div>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Material */}
      <FormField
        control={form.control}
        name="material"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              Material
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Silk, Cotton, Polyester"
                className="mt-1.5 bg-neutral-50/50 border border-neutral-200 rounded-xl h-11 px-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:ring-0 transition-all duration-200 shadow-sm"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Pickup Option */}
      <FormField
        control={form.control}
        name="pickupOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              Delivery Method
            </FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="mt-1.5 bg-neutral-50/50 border border-neutral-200 rounded-xl h-11 px-4 text-sm text-neutral-800 focus:bg-white focus:border-neutral-400 focus:ring-0 transition-all duration-200 shadow-sm">
                  <SelectValue placeholder="Select Delivery Method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Local-Pickup">Local Pick Up</SelectItem>
                <SelectItem value="Australia-wide">Shipping</SelectItem>
                <SelectItem value="Both">Shipping & Pick Up</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DescriptionAndDetailsForm;
