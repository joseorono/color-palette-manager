import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HexColorPicker } from 'react-colorful';
import { ColorUtils } from '@/lib/color-utils';
import { HexColorString } from '@/types/palette';

interface LiveColorPickerProps {
  initialColor?: HexColorString;
  onColorChange?: (color: HexColorString, colorName: string) => void;
  title?: string;
  description?: string;
  className?: string;
}

export const LiveColorPicker: React.FC<LiveColorPickerProps> = ({
  initialColor = "#FF6B6B",
  onColorChange,
  title = "Live Color Naming",
  description = "Pick any color to see how our improved naming algorithm works in real-time",
  className = ""
}) => {
  const [selectedColor, setSelectedColor] = useState<HexColorString>(initialColor);
  const colorName = ColorUtils.getColorName(selectedColor);

  const handleColorChange = useCallback((color: string) => {
    const hexColor = color as HexColorString;
    setSelectedColor(hexColor);
    const name = ColorUtils.getColorName(hexColor);
    onColorChange?.(hexColor, name);
  }, [onColorChange]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-48 h-48">
              <HexColorPicker
                color={selectedColor}
                onChange={handleColorChange}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
                <div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {selectedColor}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {colorName}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
