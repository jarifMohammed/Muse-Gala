"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onClear?: () => void;
  disabled?: boolean;
}

export function SearchInput({
  placeholder = "Search",
  className,
  onChange,
  value,
  onClear,
  disabled = false,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    setInputValue("");
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    if (onClear) {
      onClear();
    }
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors",
          isFocused ? "text-primary" : "text-[#595959]"
        )}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={cn(
          "w-full h-[49px] pl-[40px] pr-10 rounded-md border transition-colors",
          isFocused
            ? "border-primary ring-1 ring-primary/20"
            : "border border-[#E6E6E6]",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          "focus:outline-none"
        )}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
          disabled={disabled}
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
