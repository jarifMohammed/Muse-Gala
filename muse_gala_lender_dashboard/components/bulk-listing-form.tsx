/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Copy,
  UploadIcon as FileUpload,
} from "lucide-react";
import { toast } from "sonner";
import { DragDropFileUpload } from "@/components/drag-drop-file-upload";
import Image from "next/image";

interface BulkFormProps {
  onSubmit: (forms: FormData[]) => Promise<void>;
  onSaveDraft: (forms: FormData[]) => Promise<void>;
}

export interface FormData {
  id: string;
  dressName: string;
  brand: string;
  size: string;
  color: string;
  condition: string;
  category: string;
  pickupAddresses: string[];
  images: File[];
  rentalPrice4: string;
  rentalPrice8: string;
  description: string;
  materials: string;
  careInstructions: string;
}

const emptyForm = (): FormData => ({
  id: Math.random().toString(36).substring(2, 15),
  dressName: "",
  brand: "",
  size: "",
  color: "",
  condition: "",
  category: "",
  pickupAddresses: [""],
  images: [],
  rentalPrice4: "",
  rentalPrice8: "",
  description: "",
  materials: "",
  careInstructions: "",
});

export function BulkListingForm({ onSubmit, onSaveDraft }: BulkFormProps) {
  const [forms, setForms] = useState<FormData[]>([emptyForm()]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new form
  const addNewForm = () => {
    setForms([...forms, emptyForm()]);
    setActiveTab(forms.length);
  };

  // Duplicate a form
  const duplicateForm = (index: number) => {
    const formToDuplicate = {
      ...forms[index],
      id: Math.random().toString(36).substring(2, 15),
    };
    const newForms = [...forms];
    newForms.splice(index + 1, 0, formToDuplicate);
    setForms(newForms);
    setActiveTab(index + 1);
    toast.success("Form duplicated successfully");
  };

  // Remove a form
  const removeForm = (index: number) => {
    if (forms.length <= 1) {
      toast.error("Cannot remove the only form");
      return;
    }

    const newForms = [...forms];
    newForms.splice(index, 1);
    setForms(newForms);

    // Adjust active tab if necessary
    if (activeTab >= newForms.length) {
      setActiveTab(newForms.length - 1);
    }

    toast.success("Form removed successfully");
  };

  // Handle input change for a specific form
  const handleInputChange = (
    formIndex: number,
    field: keyof FormData,
    value: string
  ) => {
    const updatedForms = [...forms];
    // @ts-expect-error - This is safe as we're only updating string fields
    updatedForms[formIndex][field] = value;
    setForms(updatedForms);

    // Clear any errors for this field
    if (errors[formIndex]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[formIndex][field];
      setErrors(newErrors);
    }
  };

  // Handle image upload
  const handleImageUpload = (formIndex: number, files: FileList | null) => {
    if (!files) return;

    const updatedForms = [...forms];
    const fileArray = Array.from(files);
    updatedForms[formIndex].images = [
      ...updatedForms[formIndex].images,
      ...fileArray,
    ];
    setForms(updatedForms);
  };

  // Remove an image
  const removeImage = (formIndex: number, imageIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].images.splice(imageIndex, 1);
    setForms(updatedForms);
  };

  // Handle address changes
  const addAddress = (formIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].pickupAddresses.push("");
    setForms(updatedForms);
  };

  const removeAddress = (formIndex: number, addressIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].pickupAddresses.splice(addressIndex, 1);
    setForms(updatedForms);
  };

  const updateAddress = (
    formIndex: number,
    addressIndex: number,
    value: string
  ) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].pickupAddresses[addressIndex] = value;
    setForms(updatedForms);
  };

  // Validate forms
  const validateForms = (): boolean => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    forms.forEach((form, index) => {
      newErrors[index] = {};

      // Required fields validation
      if (!form.dressName) {
        newErrors[index].dressName = "Dress name is required";
        isValid = false;
      }

      if (!form.brand) {
        newErrors[index].brand = "Brand is required";
        isValid = false;
      }

      if (!form.size) {
        newErrors[index].size = "Size is required";
        isValid = false;
      }

      if (!form.color) {
        newErrors[index].color = "Color is required";
        isValid = false;
      }

      if (!form.condition) {
        newErrors[index].condition = "Condition is required";
        isValid = false;
      }

      if (!form.category) {
        newErrors[index].category = "Category is required";
        isValid = false;
      }

      if (!form.rentalPrice4 || isNaN(Number.parseFloat(form.rentalPrice4))) {
        newErrors[index].rentalPrice4 = "Valid price is required";
        isValid = false;
      }

      if (!form.description) {
        newErrors[index].description = "Description is required";
        isValid = false;
      }

      if (!form.materials) {
        newErrors[index].materials = "Materials are required";
        isValid = false;
      }

      if (!form.careInstructions) {
        newErrors[index].careInstructions = "Care instructions are required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForms()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(forms);
      toast.success("Listings created successfully");
      setForms([emptyForm()]);
      setActiveTab(0);
    } catch (error) {
      toast.error("Failed to create listings");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      await onSaveDraft(forms);
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear all forms
  const clearAllForms = () => {
    if (
      confirm(
        "Are you sure you want to clear all forms? This cannot be undone."
      )
    ) {
      setForms([emptyForm()]);
      setActiveTab(0);
      setErrors({});
      toast.success("All forms cleared");
    }
  };

  // Import CSV - This would be implemented in a real application
  const importCSV = () => {
    // This is a placeholder for the real implementation
    toast.info("CSV import functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      {/* Form Tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Bulk Listing Creation</h3>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={addNewForm}
              className="flex items-center text-sm px-3 py-1.5 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add New Form
            </button>
            <button
              type="button"
              onClick={() => duplicateForm(activeTab)}
              className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Copy className="h-4 w-4 mr-1" /> Duplicate Form
            </button>
            <button
              type="button"
              onClick={importCSV}
              className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FileUpload className="h-4 w-4 mr-1" /> Import CSV
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {forms.map((form, index) => (
            <button
              key={form.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                activeTab === index
                  ? "bg-[#891d33] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Form {index + 1}
              {forms.length > 1 && (
                <Trash2
                  className="h-3.5 w-3.5 ml-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeForm(index);
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active form content */}
      {forms.map((form, formIndex) => (
        <div
          key={form.id}
          className={`space-y-6 ${
            activeTab === formIndex ? "block" : "hidden"
          }`}
        >
          <div className="space-y-[30px] bg-[#FFFFFF] p-8 rounded-[15px] border border-[#E6E6E6] shadow-[0px_4px_10px_0px_#0000001A]">
            <div className="bg-white p-6 rounded-[15px] border border-[#E6E6E6]">
              <div className="">
                <h3 className="text-2xl font-normal mb-6">Basic Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-base font-normal text-[#891d33] mb-3">
                      Dress Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.dressName}
                      onChange={(e) =>
                        handleInputChange(
                          formIndex,
                          "dressName",
                          e.target.value
                        )
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.dressName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                      placeholder="Enter Dress name"
                    />
                    {errors[formIndex]?.dressName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].dressName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-normal text-[#891d33] mb-3">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) =>
                        handleInputChange(formIndex, "brand", e.target.value)
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.brand
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                      placeholder="Enter Brand Name"
                    />
                    {errors[formIndex]?.brand && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].brand}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-base font-normal text-[#891d33] mb-3">
                      Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) =>
                        handleInputChange(formIndex, "size", e.target.value)
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.size
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                    {errors[formIndex]?.size && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].size}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-normal text-[#891d33] mb-3">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) =>
                        handleInputChange(formIndex, "color", e.target.value)
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.color
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                      placeholder="Enter Colour"
                    />
                    {errors[formIndex]?.color && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].color}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-normal text-[#891d33] mb-3">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.condition}
                      onChange={(e) =>
                        handleInputChange(
                          formIndex,
                          "condition",
                          e.target.value
                        )
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.condition
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                    >
                      <option value="">Select Condition</option>
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                    {errors[formIndex]?.condition && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].condition}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#891d33] mb-3">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        handleInputChange(formIndex, "category", e.target.value)
                      }
                      className={`w-full p-2 border ${
                        errors[formIndex]?.category
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                    >
                      <option value="">Select Category</option>
                      <option value="Formal">Formal</option>
                      <option value="Cocktail">Cocktail</option>
                      <option value="Evening">Evening</option>
                      <option value="Casual">Casual</option>
                      <option value="Wedding">Wedding</option>
                    </select>
                    {errors[formIndex]?.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[formIndex].category}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location available */}
            <div className="border border-[#E6E6E6] rounded-[15px]  p-6">
              <h3 className="text-lg font-medium mb-6">Location available</h3>

              <div className="mb-4">
                <label className="block text-base font-medium text-[#891d33] mb-1">
                  Pickup Address
                </label>

                {form.pickupAddresses.map((address, addressIndex) => (
                  <div key={addressIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) =>
                        updateAddress(formIndex, addressIndex, e.target.value)
                      }
                      placeholder="e.g., ### Fashion Ln, Sydney NSW ####"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]"
                    />
                    <button
                      type="button"
                      onClick={() => removeAddress(formIndex, addressIndex)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                      disabled={form.pickupAddresses.length <= 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addAddress(formIndex)}
                  className="mt-2 flex items-center text-[#891d33] hover:text-[#732032]"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Another Address
                </button>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white p-6 rounded-[15px] border border-[#E6E6E6] ">
              <h3 className="text-lg font-medium mb-6">Media</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#891d33] mb-1">
                  Images <span className="text-red-500">*</span>
                </label>

                {/* Image preview */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {form.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative group">
                        <div className="h-32 w-full rounded-md border border-gray-300 overflow-hidden">
                          <Image
                          width={500}
                          height={500}
                            src={
                              URL.createObjectURL(image) || "/placeholder.svg"
                            }
                            alt={`Preview ${imageIndex}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(formIndex, imageIndex)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <DragDropFileUpload
                  onFilesSelected={(files: any) =>
                    handleImageUpload(formIndex, files)
                  }
                  multiple={true}
                  accept="image/*"
                  maxFiles={10}
                  maxSizeInMB={5}
                />
              </div>
            </div>

            {/* Pricing & Fees */}
            <div className="bg-white p-6 border border-[#E6E6E6] rounded-[15px] ">
              <h3 className="text-lg font-medium mb-6">Pricing & Fees</h3>
              <p className="text-xs text-gray-500 mb-4">
                Note: The daily price is inclusive of any cleaning fees.
              </p>

              <div className="grid grid-cols-1 space-y-4">
                <div>
                  <label className="block text-base font-normal text-[#891d33] mb-3">
                    Rental Price ($ / 4 days){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.rentalPrice4}
                    onChange={(e) =>
                      handleInputChange(
                        formIndex,
                        "rentalPrice4",
                        e.target.value
                      )
                    }
                    className={`w-full p-2 border ${
                      errors[formIndex]?.rentalPrice4
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                    placeholder="e.g., 40"
                  />
                  {errors[formIndex]?.rentalPrice4 && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[formIndex].rentalPrice4}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-base font-medium text-[#891d33] mb-3">
                    Rental Price ($ / 8 days)
                  </label>
                  <input
                    type="text"
                    value={form.rentalPrice8}
                    onChange={(e) =>
                      handleInputChange(
                        formIndex,
                        "rentalPrice8",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 70"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]"
                  />
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="bg-white p-6 border border-[#E6E6E6] rounded-[15px]">
              <h3 className="text-lg font-medium mb-6">
                Description & Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#891d33] mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    handleInputChange(formIndex, "description", e.target.value)
                  }
                  rows={1}
                  className={`w-full p-2 border ${
                    errors[formIndex]?.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                  placeholder="e.g., Elegant silk gown with floral embroidery, perfect for formal events."
                ></textarea>
                {errors[formIndex]?.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[formIndex].description}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#891d33] mb-1">
                  Materials <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.materials}
                  onChange={(e) =>
                    handleInputChange(formIndex, "materials", e.target.value)
                  }
                  className={`w-full p-2 border ${
                    errors[formIndex]?.materials
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                  placeholder="e.g., 100% Silk"
                />
                {errors[formIndex]?.materials && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[formIndex].materials}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#891d33] mb-1">
                  Care Instructions <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.careInstructions}
                  onChange={(e) =>
                    handleInputChange(
                      formIndex,
                      "careInstructions",
                      e.target.value
                    )
                  }
                  className={`w-full p-2 border ${
                    errors[formIndex]?.careInstructions
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-[#891d33]`}
                  placeholder="e.g., Dry clean only"
                />
                {errors[formIndex]?.careInstructions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[formIndex].careInstructions}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 border border-gray-300  rounded-[8px] bg-[#891D33] text-white">
                  Add New Form
                </button>
                <button className="px-4 py-2 border rounded-md border-[#8c1c3a] text-[#8c1c3a] hover:bg-[#8c1c3a]">
                  Duplicate Form
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="bg-white p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A]">
        <h3 className="text-2xl font-normal mb-4">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-[#891d33] text-[#891d33] rounded-md hover:bg-[#891d33] hover:bg-opacity-10"
            disabled={isSubmitting}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={clearAllForms}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Clear Form
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          By creating this listing, you agree to our Terms of Service and
          Listing Guidelines.
        </p>
      </div>
    </div>
  );
}
