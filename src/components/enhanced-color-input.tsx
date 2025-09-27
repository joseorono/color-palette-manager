import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ColorUtils } from "@/lib/color-utils";
import { HexColorString } from "@/types/palette";
import { Copy, Shuffle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EnhancedColorInputProps {
  /** Current color value in hex format */
  value: HexColorString;
  /** Callback when color changes */
  onChange: (color: HexColorString) => void;
  /** Label for the color input */
  label: string;
  /** Placeholder for the text input */
  placeholder?: string;
  /** Additional class name */
  className?: string;
  /** Show copy button */
  showCopyButton?: boolean;
  /** Show random button */
  showRandomButton?: boolean;
  /** Show color name */
  showColorName?: boolean;
  /** Custom copy handler */
  onCopy?: (color: string) => void;
  /** Custom random color handler */
  onRandomColor?: () => void;
}

export const EnhancedColorInput: React.FC<EnhancedColorInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "#000000",
  className = "",
  showCopyButton = true,
  showRandomButton = true,
  showColorName = true,
  onCopy,
  onRandomColor,
}) => {
  // Local state for input validation and focus tracking
  const [inputState, setInputState] = useState({
    value: value,
    isValid: true,
    isFocused: false,
  });

  // Update local state when external value changes
  React.useEffect(() => {
    if (!inputState.isFocused) {
      setInputState((prev) => ({
        ...prev,
        value: value,
      }));
    }
  }, [value, inputState.isFocused]);

  // Handle hex input changes with validation
  const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const isValid = newValue === "" || ColorUtils.isValidHex(newValue);

    setInputState((prev) => ({
      ...prev,
      value: newValue,
      isValid,
    }));

    // If valid and not empty, update the actual color
    if (ColorUtils.isValidHex(newValue)) {
      const normalizedHex = ColorUtils.normalizeHex(newValue) as HexColorString;
      onChange(normalizedHex);
    }
  };

  // Handle color picker changes
  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value as HexColorString;
    onChange(newColor);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (onCopy) {
      onCopy(value);
    } else {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          console.log(`Color ${value} copied to clipboard`);
        })
        .catch((err) => {
          console.error("Failed to copy to clipboard", err);
        });
    }
  };

  // Handle random color generation
  const handleRandomColor = () => {
    if (onRandomColor) {
      onRandomColor();
    } else {
      const randomColor = ColorUtils.generateRandomColorHex();
      onChange(randomColor);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}>
        {label}
      </Label>
      <div className="flex items-center gap-4">
        <Input
          id={`color-picker-${label.replace(/\s+/g, "-").toLowerCase()}`}
          type="color"
          value={value}
          onChange={handleColorPickerChange}
          className="h-12 w-20 cursor-pointer rounded border p-1"
        />
        <div className="relative flex-1">
          <TooltipProvider>
            <Tooltip open={!inputState.isValid}>
              <TooltipTrigger asChild>
                <Input
                  id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
                  type="text"
                  value={inputState.value}
                  onFocus={() => {
                    setInputState((prev) => ({
                      ...prev,
                      isFocused: true,
                    }));
                  }}
                  onBlur={() => {
                    setInputState((prev) => ({
                      ...prev,
                      isFocused: false,
                    }));
                    // When losing focus, if the value is valid, update the color
                    if (ColorUtils.isValidHex(inputState.value)) {
                      onChange(
                        ColorUtils.normalizeHex(
                          inputState.value
                        ) as HexColorString
                      );
                    }
                  }}
                  onChange={handleHexInputChange}
                  className={`flex-1 pr-8 font-mono text-sm ${
                    !inputState.isValid
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder={placeholder}
                />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="border border-red-200 bg-red-50 text-red-600"
              >
                <p>Please enter a valid hex color (e.g., #FF5500 or #F50)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showCopyButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
        {showRandomButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomColor}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate random color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {showColorName && (
        <div className="text-xs text-muted-foreground">
          {ColorUtils.getColorName(value)}
        </div>
      )}
    </div>
  );
};
