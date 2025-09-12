import * as React from "react";
import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColorUtils } from "@/lib/color-utils";
import { HexColorString, colorHexRegexZod } from "@/types/palette";
import { Palette } from "lucide-react";

export interface InlineColorPickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: HexColorString;
  onChange?: (color: HexColorString) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const InlineColorPicker = React.forwardRef<
  HTMLInputElement,
  InlineColorPickerProps
>(
  (
    {
      value = "#000000",
      onChange,
      onBlur,
      placeholder = "#000000",
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempColor, setTempColor] = useState(value);
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync temp color when value prop changes
    React.useEffect(() => {
      setTempColor(value);
      setInputValue(value);
    }, [value]);

    const isValidHex = (hex: string): boolean => {
      return colorHexRegexZod.safeParse(hex).success;
    };

    const normalizeHex = (hex: string): HexColorString => {
      // Remove # if present
      const clean = hex.replace("#", "");

      // Convert 3-digit to 6-digit hex
      if (clean.length === 3) {
        return `#${clean
          .split("")
          .map((char) => char + char)
          .join("")}`;
      }

      // Add # if not present
      return `#${clean}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Validate and update color if valid
      if (isValidHex(newValue)) {
        const normalizedHex = normalizeHex(newValue);
        setTempColor(normalizedHex);
        onChange?.(normalizedHex);
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Try to normalize the input value on blur
      if (inputValue && isValidHex(inputValue)) {
        const normalizedHex = normalizeHex(inputValue);
        setInputValue(normalizedHex);
        setTempColor(normalizedHex);
        onChange?.(normalizedHex);
      } else {
        // Reset to last valid value if invalid
        setInputValue(value);
      }
      onBlur?.(e);
    };

    const handleColorPickerChange = (newColor: string) => {
      setTempColor(newColor);
      setInputValue(newColor);
    };

    const handleApplyColor = () => {
      onChange?.(tempColor);
      setIsOpen(false);
    };

    const handleCancel = () => {
      setTempColor(value);
      setInputValue(value);
      setIsOpen(false);
    };

    const colorName = ColorUtils.getColorName(tempColor);

    return (
      <div className="relative">
        <div className="relative">
          <Input
            ref={ref || inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pl-12 font-mono", className)}
            {...props}
          />

          {/* Color preview square */}
          <div
            className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded border border-gray-300 shadow-sm"
            style={{
              backgroundColor: isValidHex(inputValue)
                ? tempColor
                : "#transparent",
            }}
          />

          {/* Color picker trigger button */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-gray-100"
                disabled={disabled}
              >
                <Palette className="h-4 w-4" />
                <span className="sr-only">Open color picker</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-4">
                {/* Color preview */}
                <div
                  className="h-12 w-full rounded-md border"
                  style={{ backgroundColor: tempColor }}
                />

                {/* Color picker */}
                <HexColorPicker
                  color={tempColor}
                  onChange={handleColorPickerChange}
                  className="!w-full"
                />

                {/* Color info */}
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="font-mono">{tempColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{colorName}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    size="sm"
                    onClick={handleApplyColor}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);

InlineColorPicker.displayName = "InlineColorPicker";
