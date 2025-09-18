import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { ToolFeatureCard } from '@/components/reusable-sections/tool-feature-card';
import { PalettePreview } from '@/components/palette-preview';
import { ColorUtils } from '@/lib/color-utils';
import { PaletteUrlUtils } from '@/lib/palette-url-utils';
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
  Blend,
  Plus,
  Minus,
  Zap
} from 'lucide-react';
import { nanoidColorId } from '@/constants/nanoid';
import { MAX_PALETTE_COLORS } from '@/constants/ui';

export const GradientGeneratorTool: React.FC = () => {
  const navigate = useNavigate();
  const [gradientColors, setGradientColors] = useState<HexColorString[]>([
    "#FF6B6B", 
    "#4ECDC4", 
    "#45B7D1"
  ]);
  const [gradientSteps, setGradientSteps] = useState<number>(10);
  const [generatedGradient, setGeneratedGradient] = useState<Color[]>([]);

  // Generate gradient when inputs change
  useEffect(() => {
    try {
      const gradientHexColors = ColorUtils.generateGradient(gradientColors, gradientSteps);
      const colorObjects: Color[] = gradientHexColors.map((hex, index) => ({
        id: nanoidColorId(),
        hex: hex as HexColorString,
        locked: false,
        name: `Gradient ${index + 1}`
      }));
      setGeneratedGradient(colorObjects);
    } catch (error) {
      console.error('Error generating gradient:', error);
      setGeneratedGradient([]);
    }
  }, [gradientColors, gradientSteps]);

  const handleGeneratePalette = () => {
    navigate(PaletteUrlUtils.generateHexCsvUrl(generatedGradient));
  };

  const handleRandomColors = () => {
    const newColors = gradientColors.map(() => ColorUtils.generateRandomColorHex());
    setGradientColors(newColors);
  };

  const handleResetSteps = () => {
    setGradientSteps(10);
  };

  const addGradientColor = () => {
    if (gradientColors.length < 8) {
      setGradientColors([...gradientColors, ColorUtils.generateRandomColorHex()]);
    }
  };

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      setGradientColors(gradientColors.filter((_, i) => i !== index));
    }
  };

  const updateGradientColor = (index: number, newColor: HexColorString) => {
    const updated = [...gradientColors];
    updated[index] = newColor;
    setGradientColors(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Blend}
          title="Gradient Generator"
          description="Create smooth color gradients between multiple colors. Perfect for backgrounds, UI elements, and design systems with customizable steps and color stops."
        />

        <div className="space-y-8">
          {/* Controls Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Gradient Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Stops */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Color Stops ({gradientColors.length})</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomColors}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addGradientColor}
                      disabled={gradientColors.length >= 8}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {gradientColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <div className="text-xs text-muted-foreground w-8">
                        {index + 1}
                      </div>
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value as HexColorString)}
                        className="w-12 h-8 p-1 rounded border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value as HexColorString)}
                        className="font-mono text-xs flex-1"
                        placeholder="#FF6B6B"
                      />
                      <div className="text-xs text-muted-foreground min-w-[80px] text-right">
                        {ColorUtils.getColorName(color)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGradientColor(index)}
                        disabled={gradientColors.length <= 2}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Gradient Steps Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Gradient Steps</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium min-w-[2rem] text-center">
                      {gradientSteps}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetSteps}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[gradientSteps]}
                    onValueChange={(value) => setGradientSteps(value[0])}
                    max={MAX_PALETTE_COLORS}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 steps</span>
                    <span>{MAX_PALETTE_COLORS} steps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Gradient Preview */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Generated Gradient ({generatedGradient.length} colors)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedGradient.length > 0 ? (
                <>
                  {/* Large Preview */}
                  <div className="space-y-3">
                    <Label>Gradient Preview</Label>
                    <PalettePreview
                      colors={generatedGradient}
                      height="6rem"
                      borderRadius="lg"
                      showTooltips={true}
                      enableCopyOnClick={true}
                      copySuccessMessage="Gradient color copied to clipboard!"
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
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Blend className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configure your gradient colors above to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <ToolSectionHeading
          title="How to Use"
          description="Create beautiful gradients by adding color stops and adjusting the number of steps"
        />

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 mb-16">
          <ToolFeatureCard
            icon={Blend}
            title="Multi-Color Gradients"
            description="Create gradients with 2-8 color stops for complex and beautiful color transitions between multiple hues"
            iconColorClasses="text-blue-600 dark:text-blue-400"
            iconBgColorClasses="bg-blue-100 dark:bg-blue-900"
          />
          <ToolFeatureCard
            icon={Zap}
            title="Adjustable Steps"
            description="Control the smoothness of your gradient by adjusting the number of steps from 3 to 20 colors"
            iconColorClasses="text-purple-600 dark:text-purple-400"
            iconBgColorClasses="bg-purple-100 dark:bg-purple-900"
          />
        </div>
      </div>
    </div>
  );
};
