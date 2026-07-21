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
import { ListingFormValues } from "@/types/listings/index";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  SIZE_OPTIONS,
} from "./form-constants";

interface Props {
  form: UseFormReturn<ListingFormValues>;
  /** Ref that the parent reads at submit-time to replace "Other" with the custom value */
  otherCategoryRef: React.MutableRefObject<string>;
}

const BasicDetailsForm = ({ form, otherCategoryRef }: Props) => {
  const [colourInput, setColourInput] = useState("");
  const colourInputRef = useRef<HTMLInputElement>(null);
  const [otherCategoryInput, setOtherCategoryInput] = useState("");

  const addColour = () => {
    const val = colourInput.trim();
    if (!val) return;
    const current = form.getValues("colour") || [];
    if (!current.includes(val)) {
      form.setValue("colour", [...current, val] as [string, ...string[]], {
        shouldValidate: true,
      });
    }
    setColourInput("");
    colourInputRef.current?.focus();
  };

  const removeColour = (c: string) => {
    const current = form.getValues("colour") || [];
    const updated = current.filter((x) => x !== c);
    form.setValue("colour", updated as [string, ...string[]], {
      shouldValidate: true,
    });
  };

  const toggleSize = (
    size: string,
    current: ListingFormValues["size"]
  ) => {
    const updated = current.includes(size as ListingFormValues["size"][number])
      ? current.filter((s) => s !== size)
      : [...current, size];
    form.setValue(
      "size",
      updated as ListingFormValues["size"],
      { shouldValidate: true }
    );
  };

  const toggleCategory = (
    cat: string,
    current: ListingFormValues["category"]
  ) => {
    const isRemoving = current.includes(cat as ListingFormValues["category"][number]);
    if (isRemoving && cat === "Other") {
      setOtherCategoryInput("");
      otherCategoryRef.current = "";
    }
    const updated = isRemoving
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    form.setValue(
      "category",
      updated as ListingFormValues["category"],
      { shouldValidate: true }
    );
  };

  // When the custom input changes, only update local state.
  // "Other" stays as a sentinel in the form array — substitution happens at submit time via otherCategoryRef.
  const handleOtherCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOtherCategoryInput(e.target.value);
    otherCategoryRef.current = e.target.value;
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Name */}
      <FormField
        control={form.control}
        name="dressName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Name</FormLabel>
            <FormControl>
              <Input placeholder="eg. Classic Tee" className="h-11 bg-neutral-50/50 focus:bg-white transition-colors" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Brand */}
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Brand</FormLabel>
            <FormControl>
              <Input placeholder="eg. Acme Co." className="h-11 bg-neutral-50/50 focus:bg-white transition-colors" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition (Select) */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Condition</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || ""}
            >
              <FormControl>
                <SelectTrigger className="h-11 bg-neutral-50/50 focus:bg-white transition-colors">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Colour — tag input */}
      <FormField
        control={form.control}
        name="colour"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Colours</FormLabel>
            <div className="flex gap-2">
              <Input
                ref={colourInputRef}
                placeholder="eg. Red, Sky Blue..."
                className="h-11 bg-neutral-50/50 focus:bg-white transition-colors"
                value={colourInput}
                onChange={(e) => setColourInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColour();
                  }
                }}
              />
              <button
                type="button"
                onClick={addColour}
                className="h-11 shrink-0 px-5 bg-black text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
              >
                Add
              </button>
            </div>
            {/* Tags */}
            {(field.value?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(field.value as string[]).map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-sm"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeColour(c)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Size — checkbox grid */}
      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Sizes</FormLabel>
            <div className="flex flex-wrap gap-3 mt-1.5">
              {SIZE_OPTIONS.map((s) => {
                const selected = (field.value as string[]).includes(s);
                return (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() =>
                        toggleSize(s, field.value)
                      }
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${selected
                        ? "bg-black border-black"
                        : "bg-white border-neutral-400"
                        }`}
                    >
                      {selected && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm font-medium">{s}</span>
                  </label>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category — checkbox grid */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">Categories</FormLabel>
            <div className="flex flex-wrap gap-3 mt-1.5">
              {CATEGORY_OPTIONS.map((opt) => {
                const isChecked = (field.value as string[]).includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() =>
                        toggleCategory(opt.value, field.value)
                      }
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${isChecked
                        ? "bg-black border-black"
                        : "bg-white border-neutral-400"
                        }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Custom category input — only when Other is selected */}
            {((field.value as string[]).includes("Other")) && (
              <div className="mt-3">
                <Input
                  placeholder="e.g., Athleisure, Vintage, Resort"
                  value={otherCategoryInput}
                  onChange={(e) => handleOtherCategoryChange(e)}
                  className="h-11 bg-neutral-50/50 border border-neutral-300 rounded-md text-sm px-3 placeholder:text-neutral-400 focus:bg-white transition-colors"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  This custom category will be submitted instead of &quot;Other&quot;
                </p>
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicDetailsForm;
