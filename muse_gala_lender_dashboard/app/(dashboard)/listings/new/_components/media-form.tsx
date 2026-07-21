import { FileUploader } from "@/components/ui/custom/file-upload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ListingFormValues } from "@/types/listings/index";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ListingFormValues>;
}

const MediaForm = ({ form }: Props) => {
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="grid grid-cols-1  gap-4">
        {/* Rental Price (4 days) */}
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <FileUploader
                  values={field.value ?? []}
                  onChange={field.onChange}
                  onUploadStateChange={() => {}}
                  id="banner"
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

export default MediaForm;
