import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { ToolFeatureCard } from '@/components/reusable-sections/tool-feature-card';
import { PalettePreview } from '@/components/palette-preview';
import { ColorUtils } from '@/lib/color-utils';
import { HexColorString, Color } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Palette,
  Sparkles,
  RotateCcw,
  Shuffle,
  Layers
} from 'lucide-react';
import { nanoidColorId } from '@/constants/nanoid';
import { MAX_PALETTE_COLORS } from '@/constants/ui';

export const ShadeGeneratorTool: React.FC = () => {
  const navigate = useNavigate();
  const [baseColor, setBaseColor] = useState<HexColorString>("#3B82F6");
  const [shadeCount, setShadeCount] = useState<number>(9);
  const [shades, setShades] = useState<Color[]>([]);

  // Generate shades when inputs change
  useEffect(() => {
    const generatedShades = ColorUtils.generateShades(baseColor, shadeCount);
    const colorObjects: Color[] = generatedShades.map((hex, index) => ({
      id: nanoidColorId(),
      hex: hex as HexColorString,
      locked: false,
      name: `${ColorUtils.getColorName(baseColor)} ${index + 1}`
    }));
    setShades(colorObjects);
  }, [baseColor, shadeCount]);

  const handleGeneratePalette = () => {
    const hexColors = shades.map(color => color.hex).join(',');
    navigate(`/app/palette-edit/?colors=${encodeURIComponent(hexColors)}`);
  };

  const handleRandomColor = () => {
    setBaseColor(ColorUtils.generateRandomColorHex());
  };

  const handleResetCount = () => {
    setShadeCount(9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Layers}
          title="Shade Generator"
          description="Generate a range of lighter and darker shades from any base color. Perfect for creating monochromatic color schemes and design systems."
        />

        <div className="space-y-8">
          {/* Controls Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Shade Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Base Color Input */}
              <div className="space-y-2">
                <Label htmlFor="baseColor">Base Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="baseColor"
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value as HexColorString)}
                    className="w-20 h-12 p-1 rounded border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value as HexColorString)}
                    className="font-mono text-sm flex-1"
                    placeholder="#3B82F6"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomColor}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {ColorUtils.getColorName(baseColor)}
                </div>
              </div>

              {/* Shade Count Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Number of Shades</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {shadeCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetCount}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[shadeCount]}
                    onValueChange={(value) => setShadeCount(value[0])}
                    max={MAX_PALETTE_COLORS}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 shades</span>
                    <span>{MAX_PALETTE_COLORS} shades</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Shades Preview */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Generated Shades ({shades.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Large Preview */}
              <div className="space-y-3">
                <Label>Shade Palette</Label>
                <PalettePreview
                  colors={shades}
                  height="6rem"
                  borderRadius="lg"
                  showTooltips={true}
                  enableCopyOnClick={true}
                  copySuccessMessage="Shade color copied to clipboard!"
                />
              </div>

              <Separator />


              {/* Generate Palette Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGeneratePalette}
                  size="lg"
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Open in Palette Editor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ToolSectionHeading
          title="How to Use"
          description="Generate beautiful shade variations from any base color with precise control"
        />

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 mb-16">
          <ToolFeatureCard
            icon={Layers}
            title="Intelligent Lightness Range"
            description="Generates shades from 20% to 90% lightness while preserving the original hue and saturation"
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900"
          />
          <ToolFeatureCard
            icon={Palette}
            title="Click to Copy"
            description="Click any shade to copy its hex value to clipboard, or use the palette editor for advanced features"
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900"
          />
        </div>
      </div>
    </div>
  );
};
