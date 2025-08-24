"use client";

import { useState, useEffect, useCallback } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { colord } from "colord";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Copy,
  Check,
  Palette,
  Eye,
  Shuffle,
  Heart,
  Info,
  Pipette,
  History,
} from "lucide-react";
import { ColorUtils } from "@/lib/color-utils";
import type { HexColorString } from "@/types/palette";
import { toast } from "@/hooks/use-toast";

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onColorChange: (color: string) => void;
}

const COLOR_PRESETS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#A3E4D7",
  "#F9E79F",
  "#FADBD8",
  "#D5DBDB",
  "#2C3E50",
  "#E74C3C",
  "#3498DB",
  "#2ECC71",
  "#F39C12",
  "#9B59B6",
  "#1ABC9C",
  "#34495E",
  "#E67E22",
  "#E91E63",
  "#8E44AD",
];

export function ColorPicker({
  isOpen,
  onClose,
  color,
  onColorChange,
}: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(color);
  const [shades, setShades] = useState<HexColorString[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 });

  useEffect(() => {
    if (isOpen) {
      setTempColor(color);
      setShades(ColorUtils.generateShades(color));
      updateColorValues(color);

      const history = localStorage.getItem("colorPickerHistory");
      if (history) setColorHistory(JSON.parse(history));
    }
  }, [isOpen, color]);

  useEffect(() => {
    setShades(ColorUtils.generateShades(tempColor));
    updateColorValues(tempColor);
  }, [tempColor]);

  const updateColorValues = useCallback((newColor: string) => {
    // Convert hex to RGB values
    const rgb = ColorUtils.HextoRgb(newColor);
    setRgbValues(rgb);

    // For HSL, we can use colord from the imports
    const hslColor = colord(newColor).toHsl();
    setHslValues({
      h: Math.round(hslColor.h),
      s: Math.round(hslColor.s * 100),
      l: Math.round(hslColor.l * 100),
    });
  }, []);

  const handleCopy = async (colorValue: string, format: string) => {
    try {
      await navigator.clipboard.writeText(colorValue);
      setCopiedStates({ ...copiedStates, [colorValue]: true });
      toast({
        title: "Copied!",
        description: `${format} value copied to clipboard`,
      });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [colorValue]: false }));
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    onColorChange(tempColor);
    const newHistory = [
      tempColor,
      ...colorHistory.filter((c) => c !== tempColor),
    ].slice(0, 20);
    setColorHistory(newHistory);
    localStorage.setItem("colorPickerHistory", JSON.stringify(newHistory));
    onClose();
  };

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setTempColor(randomColor);
  };

  const colorName = ColorUtils.getColorName(tempColor);
  const contrastWhite = ColorUtils.getContrastRatio(tempColor, "#ffffff");
  const contrastBlack = ColorUtils.getContrastRatio(tempColor, "#000000");
  const isLightColor = contrastBlack > contrastWhite;

  const ColorSwatch = ({
    color,
    size = "md",
    onClick,
    showTooltip = true,
  }: {
    color: string;
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    showTooltip?: boolean;
  }) => {
    const sizeClasses = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <button
        className={`${sizeClasses[size]} rounded-lg border-2 border-gray-200 transition-all hover:scale-110 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700`}
        style={{ backgroundColor: color }}
        onClick={onClick}
        title={showTooltip ? color : undefined}
      />
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Picker
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Main Color Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className="h-20 w-20 rounded-xl border-2 border-gray-200 shadow-lg dark:border-gray-700"
                  style={{ backgroundColor: tempColor }}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{colorName}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>
                      Best with {isLightColor ? "dark" : "light"} text
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(tempColor, "Hex")}
                    >
                      {copiedStates[tempColor] ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <Copy className="mr-1 h-3 w-3" />
                      )}
                      {tempColor}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRandomColor}
                    >
                      <Shuffle className="mr-1 h-3 w-3" />
                      Random
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="picker" id="color-picker-tabs" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="picker">
                <Pipette className="mr-1 h-4 w-4" />
                Picker
              </TabsTrigger>
              <TabsTrigger value="shades">
                <Palette className="mr-1 h-4 w-4" />
                Shades
              </TabsTrigger>
              <TabsTrigger value="values">
                <Info className="mr-1 h-4 w-4" />
                Values
              </TabsTrigger>
              <TabsTrigger value="presets">
                <History className="mr-1 h-4 w-4" />
                Presets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="picker" className="space-y-4">
              <div className="flex justify-center">
                <HexColorPicker
                  color={tempColor}
                  onChange={setTempColor}
                  style={{ width: "200px", height: "200px" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hex-input">Hex Code</Label>
                <HexColorInput
                  id="hex-input"
                  color={tempColor}
                  onChange={setTempColor}
                  className="w-full rounded-md border bg-background px-3 py-2 font-mono text-foreground"
                  prefixed
                />
              </div>
            </TabsContent>

            <TabsContent value="shades" className="space-y-4">
              <div>
                <Label className="mb-3 block text-sm font-medium">Shades</Label>
                <div className="grid grid-cols-9 gap-2">
                  {shades.map((shade, index) => (
                    <ColorSwatch
                      key={index}
                      color={shade}
                      onClick={() => setTempColor(shade)}
                      showTooltip={true}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="values" className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{colorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contrast (White):</span>
                  <span className="font-medium">
                    {contrastWhite.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contrast (Black):</span>
                  <span className="font-medium">
                    {contrastBlack.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <h4 className="font-medium">RGB Values</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-4">R:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgbValues.r}
                          onChange={(e) => {
                            const newR = Number.parseInt(e.target.value) || 0;
                            const newRgb = { ...rgbValues, r: newR };
                            setRgbValues(newRgb);
                            // setTempColor(ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                          }}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-4">G:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgbValues.g}
                          onChange={(e) => {
                            const newG = Number.parseInt(e.target.value) || 0;
                            const newRgb = { ...rgbValues, g: newG };
                            setRgbValues(newRgb);
                            // setTempColor(
                            //   ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b)
                            // );
                          }}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-4">B:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgbValues.b}
                          onChange={(e) => {
                            const newB = Number.parseInt(e.target.value) || 0;
                            const newRgb = { ...rgbValues, b: newB };
                            setRgbValues(newRgb);
                            // setTempColor(
                            //   ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b)
                            // );
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-3 p-4">
                    <h4 className="font-medium">Accessibility</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Contrast vs White:</span>
                        <Badge
                          variant={
                            contrastWhite >= 4.5 ? "default" : "destructive"
                          }
                        >
                          {contrastWhite.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Contrast vs Black:</span>
                        <Badge
                          variant={
                            contrastBlack >= 4.5 ? "default" : "destructive"
                          }
                        >
                          {contrastBlack.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>WCAG AA:</span>
                        <Badge
                          variant={
                            Math.max(contrastWhite, contrastBlack) >= 4.5
                              ? "default"
                              : "destructive"
                          }
                        >
                          {Math.max(contrastWhite, contrastBlack) >= 4.5
                            ? "Pass"
                            : "Fail"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div>
                <Label className="mb-3 block text-sm font-medium">
                  Popular Colors
                </Label>
                <div className="grid grid-cols-10 gap-2">
                  {COLOR_PRESETS.map((preset, index) => (
                    <ColorSwatch
                      key={`preset-${index}`}
                      color={preset}
                      onClick={() => setTempColor(preset)}
                    />
                  ))}
                </div>
              </div>

              {colorHistory.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="mb-3 block text-sm font-medium">
                      Recent Colors
                    </Label>
                    <div className="grid grid-cols-10 gap-2">
                      {colorHistory.slice(0, 20).map((historyColor, index) => (
                        <ColorSwatch
                          key={`history-${index}`}
                          color={historyColor}
                          onClick={() => setTempColor(historyColor)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Apply Color</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
