"use client"

import { useState, useEffect, useRef } from "react"
// import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectDropdownProps {
  label: string
  options?: string[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SelectDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className = "",
  disabled = false,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (option: string) => {
    setSelectedValue(option)
    if (onChange) onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "flex items-center  justify-end px-4 py-2.5 border rounded-md bg-white cursor-pointer transition-colors",
          isOpen && "border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        // role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium truncate">{selectedValue || label || placeholder}</span>
        {/* <ChevronDown className={cn("h-4 w-4  text-white transition-transform", isOpen && "transform rotate-180")} /> */}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto" role="listbox">
            {options && options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  className={cn(
                    "px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm",
                    selectedValue === option && "bg-primary/10 font-medium",
                  )}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selectedValue === option}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-sm">No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
