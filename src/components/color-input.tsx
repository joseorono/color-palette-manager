import React from "react";
import { colord } from "colord";
import { HexColorString } from "@/types/palette";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ColorInputProps {
  /** Current color value in hex format */
  value: HexColorString;
  /** Callback when color changes */
  onChange: (color: HexColorString) => void;
  /** Label for the color input (optional) */
  label?: string;
  /** Placeholder for the text input */
  placeholder?: string;
  /** Additional class name */
  className?: string;
}

/**
 * A reusable color input component with color picker and hex input
 */
export const ColorInput: React.FC<ColorInputProps> = ({
  value,
  onChange,
  label = "Hex Color",
  placeholder = "#3B82F6",
  className = "",
}) => {
  const handleColorChange = (hexValue: string) => {
    try {
      const color = colord(hexValue);
      if (color.isValid()) {
        // Format and normalize the hex value
        const normalizedHex = color.toHex().toUpperCase() as HexColorString;
        onChange(normalizedHex);
      }
    } catch (error) {
      console.error("Error parsing color:", error);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor="color-input">{label}</Label>}
      <div className="flex items-center gap-2">
        {
          <Input
            id="color-input"
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded border p-1"
          />
        }
        {
          <Input
            type="text"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="font-mono text-sm"
            placeholder={placeholder}
          />
        }
      </div>
    </div>
  );
};
