"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
  label?: string;
}

export function ColorPicker({
  initialColor = "red",
  onChange,
  label = "Color",
}: ColorPickerProps) {
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    // Update color if initialColor prop changes
    setColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="color-picker">{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-md border"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            value={color}
            onChange={handleColorChange}
            className="h-10 flex-1"
            placeholder="Red"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            title="Hexadecimal color code (e.g. #FF0000)"
          />
        </div>
      </div>
    </div>
  );
}
