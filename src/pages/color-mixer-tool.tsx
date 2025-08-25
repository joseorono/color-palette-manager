import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ColorUtils } from '@/lib/color-utils';
import { PaletteUrlUtils } from '@/lib/palette-url-utils';
import { HexColorString } from '@/types/palette';
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
  Droplets,
  Plus,
  Minus
} from 'lucide-react';

export const ColorMixerTool: React.FC = () => {
  const navigate = useNavigate();
  const [color1, setColor1] = useState<HexColorString>("#FF6B6B");
  const [color2, setColor2] = useState<HexColorString>("#4ECDC4");
  const [mixRatio, setMixRatio] = useState<number>(50);
  const [mixedColor, setMixedColor] = useState<HexColorString>("#FF6B6B");
  const [mixingMethod, setMixingMethod] = useState<'HSL' | 'RGB'>('HSL');
  const [multiColors, setMultiColors] = useState<HexColorString[]>(["#FF6B6B", "#4ECDC4", "#45B7D1"]);
  const [multiMixedColor, setMultiMixedColor] = useState<HexColorString>("#FF6B6B");

  // Update mixed color when inputs change
  useEffect(() => {
    const ratio = mixRatio / 100;
    const mixed = mixingMethod === 'HSL' 
      ? ColorUtils.mixColors(color1, color2, ratio)
      : ColorUtils.mixColorsRGB(color1, color2, ratio);
    setMixedColor(mixed);
  }, [color1, color2, mixRatio, mixingMethod]);

  // Update multi-color mix when colors change
  useEffect(() => {
    const mixed = ColorUtils.mixMultipleColors(multiColors);
    setMultiMixedColor(mixed);
  }, [multiColors]);

  const handleGeneratePalette = (baseColor: HexColorString) => {
    navigate(PaletteUrlUtils.generateUrlToPaletteFromBaseColor(baseColor));
  };

  const handleRandomColors = () => {
    setColor1(ColorUtils.generateRandomColorHex());
    setColor2(ColorUtils.generateRandomColorHex());
  };

  const handleResetRatio = () => {
    setMixRatio(50);
  };

  const addMultiColor = () => {
    if (multiColors.length < 8) {
      setMultiColors([...multiColors, ColorUtils.generateRandomColorHex()]);
    }
  };

  const removeMultiColor = (index: number) => {
    if (multiColors.length > 2) {
      setMultiColors(multiColors.filter((_, i) => i !== index));
    }
  };

  const updateMultiColor = (index: number, newColor: HexColorString) => {
    const updated = [...multiColors];
    updated[index] = newColor;
    setMultiColors(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Droplets}
          title="Color Mixer"
          description="Mix two or more colors to create new ones. Experiment with different mixing ratios and methods to discover unique color combinations."
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Two-Color Mixer */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Two-Color Mixer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color1">Color 1</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color1"
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value as HexColorString)}
                      className="w-16 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value as HexColorString)}
                      className="font-mono text-sm"
                      placeholder="#FF6B6B"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ColorUtils.getColorName(color1)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color2">Color 2</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color2"
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value as HexColorString)}
                      className="w-16 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value as HexColorString)}
                      className="font-mono text-sm"
                      placeholder="#4ECDC4"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ColorUtils.getColorName(color2)}
                  </div>
                </div>
              </div>

              {/* Mixing Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mixing Ratio</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetRatio}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomColors}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[mixRatio]}
                    onValueChange={(value) => setMixRatio(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100% Color 1</span>
                    <span>{mixRatio}% Color 2</span>
                    <span>100% Color 2</span>
                  </div>
                </div>

                {/* Mixing Method */}
                <div className="flex items-center gap-2">
                  <Label>Method:</Label>
                  <Button
                    variant={mixingMethod === 'HSL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMixingMethod('HSL')}
                  >
                    HSL
                  </Button>
                  <Button
                    variant={mixingMethod === 'RGB' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMixingMethod('RGB')}
                  >
                    RGB
                  </Button>
                </div>
              </div>

              {/* Result */}
              <div className="space-y-3">
                <Label>Mixed Result</Label>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border-2 border-border"
                    style={{ backgroundColor: mixedColor }}
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm font-medium">{mixedColor}</div>
                    <div className="text-sm text-muted-foreground">
                      {ColorUtils.getColorName(mixedColor)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleGeneratePalette(mixedColor)}
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Palette
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Color Mixer */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Multi-Color Mixer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Colors ({multiColors.length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addMultiColor}
                    disabled={multiColors.length >= 8}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {multiColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateMultiColor(index, e.target.value as HexColorString)}
                        className="w-10 h-8 p-1 rounded border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => updateMultiColor(index, e.target.value as HexColorString)}
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMultiColor(index)}
                        disabled={multiColors.length <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Multi-Color Result */}
              <div className="space-y-3">
                <Label>Average Mix Result</Label>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border-2 border-border"
                    style={{ backgroundColor: multiMixedColor }}
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm font-medium">{multiMixedColor}</div>
                    <div className="text-sm text-muted-foreground">
                      {ColorUtils.getColorName(multiMixedColor)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleGeneratePalette(multiMixedColor)}
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Palette
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">HSL vs RGB Mixing</h3>
            <p className="text-sm text-muted-foreground">
              Choose between HSL (perceptually uniform) and RGB (additive) color mixing methods for different results
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Color Averaging</h3>
            <p className="text-sm text-muted-foreground">
              Mix multiple colors simultaneously using HSL averaging for harmonious results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
