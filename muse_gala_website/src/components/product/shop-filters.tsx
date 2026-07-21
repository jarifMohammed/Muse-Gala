"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FilterOptions } from "@/lib/filter-utils";
import { DualRangeSlider } from "../ui/DualRangeSlider";

interface ShopFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export function ShopFilters({ filters, onFilterChange }: ShopFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    availableNearMe: true,
    rentalDuration: true,
    localPickup: true,
    eventDate: true,
    price: true,
    color: true,
    size: true,
    designer: true,
    category: true,
    location: true,
  });

  // State for the pickup distance slider
  const [pickupDistance, setPickupDistance] = useState(
    filters.pickupDistance || 50
  );

  // Update filters when pickup distance changes
  useEffect(() => {
    if (pickupDistance !== filters.pickupDistance) {
      onFilterChange({ pickupDistance });
    }
  }, [pickupDistance, filters.pickupDistance, onFilterChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...(filters.sizes || []), size]
      : (filters.sizes || []).filter((s) => s !== size);

    onFilterChange({ sizes: newSizes });
  };

  type RentalDuration = string;
  const handleRentalDurationChange = (
    duration: RentalDuration,
    checked: boolean
  ) => {
    const newDurations = checked
      ? [...(filters.rentalDurations || []), duration]
      : (filters.rentalDurations || []).filter((d) => d !== duration);

    onFilterChange({ rentalDurations: newDurations });
  };

  const handleAvailableNearMeChange = (checked: boolean) => {
    onFilterChange({ availableNearMe: checked });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...(filters.colors || []), color]
      : (filters.colors || []).filter((c) => c !== color);

    onFilterChange({ colors: newColors });
  };

  // const handlePriceChange = (value: number) => {
  //   onFilterChange({ priceRange: value });
  // };

  // const handleEventDateChange = (date: string) => {
  //   onFilterChange({ eventDate: date });
  // };

  const handleDesignerChange = (designer: string, checked: boolean) => {
    const newDesigners = checked
      ? [...(filters.designers || []), designer]
      : (filters.designers || []).filter((d) => d !== designer);

    onFilterChange({ designers: newDesigners });
  };
  const [values, setValues] = useState([0, 100]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...(filters.categories || []), category]
      : (filters.categories || []).filter((c) => c !== category);

    onFilterChange({ categories: newCategories });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...(filters.locations || []), location]
      : (filters.locations || []).filter((l) => l !== location);

    onFilterChange({ locations: newLocations });
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex justify-between items-center w-full text-left text-xs uppercase tracking-widest mb-3"
      >
        {title}
        {expandedSections[section] ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>
      {expandedSections[section] && children}
    </div>
  );

  const Checkbox = ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer border-gray-300 rounded text-black focus:ring-black"
      />
      <label htmlFor={id} className="ml-2 text-xs uppercase tracking-wider">
        {label}
      </label>
    </div>
  );

  const ColorOption = ({
    color,
    label,
    checked,
    onChange,
  }: {
    color: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={`color-${color}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <label
        htmlFor={`color-${color}`}
        className="flex items-center cursor-pointer"
      >
        <span
          className={`inline-block w-4 h-4 rounded-full mr-2 ${checked ? "ring-1 ring-black" : ""
            }`}
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </label>
    </div>
  );

  return (
    <div className="mt-6 font-avenir">
      <Checkbox
        id="available-near-me"
        label="AVAILABLE NEAR ME"
        checked={filters.availableNearMe || false}
        onChange={handleAvailableNearMeChange}
      />

      <div className="mb-6 mt-4">
        <Checkbox
          id="4-day-rental"
          label="4-DAY RENTAL"
          checked={filters.rentalDurations?.includes("4") || false}
          onChange={(checked) => handleRentalDurationChange("4", checked)}
        />
        <Checkbox
          id="8-day-rental"
          label="8-DAY RENTAL"
          checked={filters.rentalDurations?.includes("8") || false}
          onChange={(checked) => handleRentalDurationChange("8", checked)}
        />
      </div>

      <FilterSection title="LOCAL PICKUP" section="localPickup">
        <div className="mb-4">
          <div className="relative pt-1">
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={pickupDistance}
              onChange={(e) => setPickupDistance(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-full flex justify-between text-xs text-gray-500 mt-2">
              <span>5km</span>
              <span>50km</span>
              <span>100km</span>
            </div>
          </div>
        </div>
        {/* <select
          className="w-full border border-gray-300 py-2 px-3 text-xs tracking-wider focus:outline-none focus:ring-1 focus:ring-black focus:border-black mt-4"
          onChange={(e) => onFilterChange({ pickupLocation: e.target.value })}
          value={filters.pickupLocation || ""}
        >
          <option value="">Select location</option>
          <option value="location-1">Location 1</option>
          <option value="location-2">Location 2</option>
          <option value="location-3">Location 3</option>
        </select> */}
      </FilterSection>

      <div className="w-full space-y-5   mb-10 mt-9">
        <DualRangeSlider
          label={(value) => `${value}$`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <FilterSection title="COLOR" section="color">
        <ColorOption
          color="#FF0000"
          label="COLOR 1"
          checked={filters.colors?.includes("#FF0000") || false}
          onChange={(checked) => handleColorChange("#FF0000", checked)}
        />
        <ColorOption
          color="#00FF00"
          label="COLOR 2"
          checked={filters.colors?.includes("#00FF00") || false}
          onChange={(checked) => handleColorChange("#00FF00", checked)}
        />
        <ColorOption
          color="#0000FF"
          label="COLOR 3"
          checked={filters.colors?.includes("#0000FF") || false}
          onChange={(checked) => handleColorChange("#0000FF", checked)}
        />
      </FilterSection>

      <FilterSection title="SIZE" section="size">
        <Checkbox
          id="size-xxs"
          label="XXS"
          checked={filters.sizes?.includes("XXS") || false}
          onChange={(checked) =>
            handleSizeChange("XXS", checked)
          }
        />
        <Checkbox
          id="size-xs"
          label="XS"
          checked={filters.sizes?.includes("XS") || false}
          onChange={(checked) => handleSizeChange("XS", checked)}
        />
        <Checkbox
          id="size-s"
          label="S"
          checked={filters.sizes?.includes("S") || false}
          onChange={(checked) => handleSizeChange("S", checked)}
        />
        <Checkbox
          id="size-m"
          label="M"
          checked={filters.sizes?.includes("M") || false}
          onChange={(checked) => handleSizeChange("M", checked)}
        />
        <Checkbox
          id="size-l"
          label="L"
          checked={filters.sizes?.includes("L") || false}
          onChange={(checked) => handleSizeChange("L", checked)}
        />
        <Checkbox
          id="size-xl"
          label="XL"
          checked={filters.sizes?.includes("XL") || false}
          onChange={(checked) => handleSizeChange("XL", checked)}
        />
      </FilterSection>

      <FilterSection title="DESIGNER" section="designer">
        <Checkbox
          id="designer-1"
          label="DESIGNER 1"
          checked={filters.designers?.includes("designer-1") || false}
          onChange={(checked) => handleDesignerChange("designer-1", checked)}
        />
        <Checkbox
          id="designer-2"
          label="DESIGNER 2"
          checked={filters.designers?.includes("designer-2") || false}
          onChange={(checked) => handleDesignerChange("designer-2", checked)}
        />
        <Checkbox
          id="designer-3"
          label="DESIGNER 3"
          checked={filters.designers?.includes("designer-3") || false}
          onChange={(checked) => handleDesignerChange("designer-3", checked)}
        />
      </FilterSection>

      <FilterSection title="CATEGORY" section="category">
        <Checkbox
          id="category-1"
          label="CATEGORY 1"
          checked={filters.categories?.includes("category-1") || false}
          onChange={(checked) => handleCategoryChange("category-1", checked)}
        />
        <Checkbox
          id="category-2"
          label="CATEGORY 2"
          checked={filters.categories?.includes("category-2") || false}
          onChange={(checked) => handleCategoryChange("category-2", checked)}
        />
        <Checkbox
          id="category-3"
          label="CATEGORY 3"
          checked={filters.categories?.includes("category-3") || false}
          onChange={(checked) => handleCategoryChange("category-3", checked)}
        />
      </FilterSection>

      <FilterSection title="LOCATION" section="location">
        <Checkbox
          id="location-1"
          label="LOCATION 1"
          checked={filters.locations?.includes("location-1") || false}
          onChange={(checked) => handleLocationChange("location-1", checked)}
        />
        <Checkbox
          id="location-2"
          label="LOCATION 2"
          checked={filters.locations?.includes("location-2") || false}
          onChange={(checked) => handleLocationChange("location-2", checked)}
        />
        <Checkbox
          id="location-3"
          label="LOCATION 3"
          checked={filters.locations?.includes("location-3") || false}
          onChange={(checked) => handleLocationChange("location-3", checked)}
        />
      </FilterSection>
    </div>
  );
}
