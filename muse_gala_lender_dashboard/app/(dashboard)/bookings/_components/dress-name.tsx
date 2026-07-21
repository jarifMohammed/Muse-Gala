"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import React, { useState } from "react";

interface ListingInfo {
  _id: string;
  dressName: string;
  media: string[];
  size: string[];
}

interface Props {
  listingInfo: {
    data: {
      data: ListingInfo[];
    };
  };
  selectedDressId: string;
  setSelectedDressId: (id: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

const DressName = ({
  listingInfo,
  selectedDressId,
  setSelectedDressId,
  selectedSize,
  setSelectedSize,
}: Props) => {
  const data = listingInfo?.data?.data;

  const selectedDress = data?.find((item) => item._id === selectedDressId);
  const availableSizes = selectedDress?.size || [];

  const handleDressChange = (value: string) => {
    setSelectedDressId(value);
    setSelectedSize("");
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-medium mb-2">
        Dress Details <span className="text-xl text-red-500">*</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Dress
          </label>
          <Select value={selectedDressId} onValueChange={handleDressChange}>
            <SelectTrigger className="w-full h-12 md:h-[60px]">
              <SelectValue placeholder="Choose a dress" />
            </SelectTrigger>
            <SelectContent>
              {data?.map((item) => (
                <SelectItem key={item?._id} value={item?._id}>
                  <div className="flex items-center gap-3">
                    <Image
                      src={item?.media[0]}
                      alt={item?.dressName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item?.dressName}</p>
                      <p className="text-[10px] text-gray-500">
                        Sizes: {item?.size?.join(", ")}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Select */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Size
          </label>
          <Select
            value={selectedSize}
            onValueChange={handleSizeChange}
            disabled={!selectedDressId || availableSizes.length === 0}
          >
            <SelectTrigger className="w-full h-12 md:h-[60px]">
              <SelectValue
                placeholder={
                  !selectedDressId
                    ? "Select dress first"
                    : availableSizes.length === 0
                      ? "No sizes available"
                      : "Choose size"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  Size {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDress && (
        <div className="p-4 bg-gray-50 rounded-md border">
          <div className="flex items-center gap-4">
            <Image
              src={selectedDress.media[0]}
              alt={selectedDress.dressName}
              width={80}
              height={80}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{selectedDress.dressName}</h3>
              <p className="text-sm text-gray-600">
                Selected Size: {selectedSize || "Not selected"}
              </p>
              <p className="text-sm text-gray-500">
                Available: {availableSizes.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DressName;
