import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colord } from "colord";
import { ToolHeroSection } from "@/components/reusable-sections/tool-hero-section";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { HexColorString } from "@/types/palette";
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolSectionHeading } from "@/components/reusable-sections/tool-section-heading";
import { ToolFeatureCard } from "@/components/reusable-sections/tool-feature-card";
import {
  Sparkles,
  RotateCcw,
  Shuffle,
  Sliders,
  Copy,
  Sun,
  Droplet,
  Circle,
} from "lucide-react";

export const HslColorPickerTool: React.FC = () => {
  const navigate = useNavigate();
  const { copyToClipboard } = useCopyToClipboard({ showToast: true });

  // HSL state values (0-360 for hue, 0-100 for saturation and lightness)
  const [hue, setHue] = useState<number>(220);
  const [saturation, setSaturation] = useState<number>(90);
  const [lightness, setLightness] = useState<number>(56);
  const [currentColor, setCurrentColor] = useState<HexColorString>("#3B82F6");

  // Update color when HSL values change
  useEffect(() => {
    try {
      // Ensure valid HSL values with simple bounds checking
      const validHue = Math.max(0, Math.min(360, hue || 220));
      const validSaturation = Math.max(0, Math.min(100, saturation || 90));
      const validLightness = Math.max(0, Math.min(100, lightness || 56));

      // Use direct HSL string conversion
      const hslString = `hsl(${validHue}, ${validSaturation}%, ${validLightness}%)`;
      const color = colord(hslString);

      if (color.isValid()) {
        const hexColor = color.toHex().toUpperCase() as HexColorString;
        // Prevent black colors
        if (hexColor !== "#000000" && hexColor !== "#010101") {
          setCurrentColor(hexColor);
        }
      }
    } catch (error) {
      console.error("Error updating color:", error);
    }
  }, [hue, saturation, lightness]);

  const handleGeneratePalette = () => {
    navigate(PaletteUrlUtils.generateUrlToPaletteFromBaseColor(currentColor));
  };

  const handleRandomColor = () => {
    setHue(Math.floor(Math.random() * 360));
    setSaturation(Math.floor(Math.random() * 100));
    setLightness(Math.floor(Math.random() * 80) + 10); // 10-90% to avoid pure black/white
  };

  const handleResetToDefault = () => {
    setHue(220);
    setSaturation(90);
    setLightness(56);
  };

  const handleHexInput = (hexValue: string) => {
    try {
      const color = colord(hexValue);
      if (color.isValid()) {
        // Store the original hex value
        setCurrentColor(color.toHex().toUpperCase() as HexColorString);

        // Get HSL values with fallbacks
        const hsl = color.toHsl();
        const h = hsl.h ?? 220;
        const s = hsl.s ?? 0.9;
        const l = hsl.l ?? 0.56;
        
        // Update HSL state values
        setHue(Math.round(h));
        setSaturation(Math.round(s * 100));
        setLightness(Math.round(l * 100));
      }
    } catch (error) {
      console.error("Error parsing color:", error);
    }
  };

  const getHueGradient = () => {
    return `linear-gradient(to right, 
      hsl(0, ${saturation}%, ${lightness}%), 
      hsl(60, ${saturation}%, ${lightness}%), 
      hsl(120, ${saturation}%, ${lightness}%), 
      hsl(180, ${saturation}%, ${lightness}%), 
      hsl(240, ${saturation}%, ${lightness}%), 
      hsl(300, ${saturation}%, ${lightness}%), 
      hsl(360, ${saturation}%, ${lightness}%))`;
  };

  const getSaturationGradient = () => {
    return `linear-gradient(to right, 
      hsl(${hue}, 0%, ${lightness}%), 
      hsl(${hue}, 100%, ${lightness}%))`;
  };

  const getLightnessGradient = () => {
    return `linear-gradient(to right, 
      hsl(${hue}, ${saturation}%, 0%), 
      hsl(${hue}, ${saturation}%, 50%), 
      hsl(${hue}, ${saturation}%, 100%))`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Sliders}
          title="HSL Color Picker"
          description="Explore the color space with interactive Hue, Saturation, and Lightness sliders. Perfect for understanding how HSL properties affect color appearance."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Color Preview */}
          <Card className="border-0 bg-card/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="h-5 w-5" />
                Color Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Large Color Display */}
              <div className="space-y-4">
                <div
                  className="h-32 w-full rounded-lg border-2 border-border shadow-md transition-colors duration-200"
                  style={{ backgroundColor: currentColor }}
                />

                {/* Color Name */}
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-semibold">
                    {ColorUtils.getColorName(currentColor)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    HSL({hue}, {saturation}%, {lightness}%)
                  </p>
                </div>
              </div>

              {/* Hex Input */}
              <div className="space-y-2">
                <Label htmlFor="hex-input">Hex Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="hex-input"
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border p-1"
                  />
                  <Input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomColor}
                  className="flex-1"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Random
                </Button>
              </div>

              <Button
                onClick={handleGeneratePalette}
                className="w-full"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Palette
              </Button>
            </CardContent>
          </Card>

          {/* HSL Controls */}
          <Card className="border-0 bg-card/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                HSL Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Hue Slider */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-red-500" />
                  <Label>Hue: {hue}°</Label>
                </div>
                <div className="relative">
                  <div
                    className="h-4 rounded-full border"
                    style={{ background: getHueGradient() }}
                  />
                  <Slider
                    value={[hue]}
                    onValueChange={(value) => setHue(value[0])}
                    max={360}
                    min={0}
                    step={1}
                    className="absolute inset-0"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Red (0°)</span>
                  <span>Yellow (60°)</span>
                  <span>Green (120°)</span>
                  <span>Cyan (180°)</span>
                  <span>Blue (240°)</span>
                  <span>Magenta (300°)</span>
                </div>
              </div>

              {/* Saturation Slider */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <Label>Saturation: {saturation}%</Label>
                </div>
                <div className="relative">
                  <div
                    className="h-4 rounded-full border"
                    style={{ background: getSaturationGradient() }}
                  />
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="absolute inset-0"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Gray (0%)</span>
                  <span>Vivid (100%)</span>
                </div>
              </div>

              {/* Lightness Slider */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <Label>Lightness: {lightness}%</Label>
                </div>
                <div className="relative">
                  <div
                    className="h-4 rounded-full border"
                    style={{ background: getLightnessGradient() }}
                  />
                  <Slider
                    value={[lightness]}
                    onValueChange={(value) => setLightness(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="absolute inset-0"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Black (0%)</span>
                  <span>Normal (50%)</span>
                  <span>White (100%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Formats */}
        <Card className="mt-8 border-0 bg-card/50 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Color Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(
                ColorUtils.getAllColorFormatsFromHex(currentColor)
              ).map(([format, value]) => (
                <div
                  key={format}
                  className="space-y-2 rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium uppercase text-muted-foreground">
                      {format}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          value,
                          `${format.toUpperCase()} color copied: ${value}`
                        )
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="break-all font-mono text-sm">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ToolSectionHeading
          title="How to Use"
          description="Master the HSL color space with interactive sliders and real-time feedback"
        />

        {/* Educational Features Section */}
        <div className="mb-16 mt-16 grid gap-6 md:grid-cols-3">
          <ToolFeatureCard
            icon={Circle}
            title="Hue Control"
            description="Adjust the color wheel position (0-360°) to change the base color family"
            iconColorClasses="text-red-600 dark:text-red-400"
            iconBgColorClasses="bg-red-100 dark:bg-red-900"
          />
          <ToolFeatureCard
            icon={Droplet}
            title="Saturation Control"
            description="Control color intensity from grayscale (0%) to fully vivid (100%)"
            iconColorClasses="text-blue-600 dark:text-blue-400"
            iconBgColorClasses="bg-blue-100 dark:bg-blue-900"
          />
          <ToolFeatureCard
            icon={Sun}
            title="Lightness Control"
            description="Adjust brightness from black (0%) to white (100%)"
            iconColorClasses="text-yellow-600 dark:text-yellow-400"
            iconBgColorClasses="bg-yellow-100 dark:bg-yellow-900"
          />
        </div>
      </div>
    </div>
  );
};
