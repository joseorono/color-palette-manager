import { useState, useEffect, useCallback } from "react";
import { Slider } from "./slider";
import { debounce as debounceUtil } from "@/lib/utils";
import { Label } from "./label";

export function DebouncedSlider({
  value: initialValue,
  className,
  onChange,
  debounce = 500,
  ...props
}: {
  value: number[];
  onChange: (value: number[]) => void;
  debounce?: number;
  className?: string;
} & Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "onValueChange" | "onChange"
>) {
  const [value, setValue] = useState(initialValue);
  const [internalValue, setInternalValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    setInternalValue(initialValue);
  }, [initialValue]);

  const debouncedOnChange = useCallback(
    debounceUtil((value: number[]) => {
      onChange(value);
    }, debounce),
    [onChange]
  );

  const handleInternalValue = useCallback(
    (value: number[]) => {
      setInternalValue(value);
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  return (
    <>
      <Label className="mb-2 block text-sm font-medium">
        Palette Size: {internalValue[0]} colors
      </Label>
      <Slider
        {...props}
        className={className}
        value={internalValue}
        onValueChange={(newValue) => handleInternalValue(newValue)}
      />
    </>
  );
}
