import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ListingFormValues } from "@/types/listings/index";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ListingFormValues>;
}

const PricingAndFeesForm = ({ form }: Props) => {
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rental Price (4 days) */}
        <FormField
          control={form.control}
          name="rentalPrice.fourDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Rental Price ($ / 4 days){" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ##"
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} // 👈 ensures number
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rental Price (8 days) */}
        <FormField
          control={form.control}
          name="rentalPrice.eightDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Rental Price ($ / 8 days){" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ##"
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} // 👈 ensures number
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PricingAndFeesForm;
