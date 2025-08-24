import React, { useState } from 'react';
import { LiveColorPicker } from '@/components/color-naming/live-color-picker';
import { ColorCard } from '@/components/color-naming/color-card';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ColorUtils } from '@/lib/color-utils';
import { HexColorString } from '@/types/palette';
import { Palette, Sparkles, Eye } from 'lucide-react';

// Featured color examples to showcase the naming system
const featuredColors: HexColorString[] = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#74B9FF", "#A29BFE", "#FD79A8", "#FDCB6E",
  "#6C5CE7", "#00B894", "#E17055", "#FF0000", "#00FF00",
  "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000"
];

export const ColorNamingTool: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<HexColorString>("#FF6B6B");
  const [currentColorName, setCurrentColorName] = useState<string>(
    ColorUtils.getColorName("#FF6B6B")
  );

  const handleColorChange = (color: HexColorString, colorName: string) => {
    setCurrentColor(color);
    setCurrentColorName(colorName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Palette}
          title="Color Naming Tool"
          description="Pick any color and get instant, descriptive names that make sense. Useful for better comunicating what kind of color you are using."
        />

        {/* Main Color Picker Section */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-4xl">
            <LiveColorPicker
              initialColor={currentColor}
              onColorChange={handleColorChange}
              title="Interactive Color Picker"
              description="Explore our intelligent color naming system. The algorithm combines exact color matches, perceptual analysis, and descriptive naming for the most accurate results."
              className="shadow-xl border-0 bg-card/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Current Color Showcase */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg">
            <div
              className="w-16 h-16 rounded-xl shadow-md border-2 border-border"
              style={{ backgroundColor: currentColor }}
            />
            <div className="text-left">
              <div className="text-sm text-muted-foreground font-mono">
                {currentColor}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currentColorName}
              </div>
            </div>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Exact Matches</h3>
            <p className="text-sm text-muted-foreground">
              Recognizes standard color names like "Crimson", "Turquoise", and "Indigo"
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Uses perceptual color distance and hue analysis for accurate naming
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Descriptive Names</h3>
            <p className="text-sm text-muted-foreground">
              Generates meaningful descriptions like "Deep Ocean Blue" or "Warm Sunset Orange"
            </p>
          </div>
        </div>

        {/* Featured Colors Gallery */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Featured Color Examples
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore these curated colors to see our naming system in action
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredColors.map((hex) => (
            <ColorCard
              key={hex}
              hex={hex}
              colorName={ColorUtils.getColorName(hex)}
              showType={false}
              className="hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border">
          <h3 className="text-xl font-semibold mb-2">Ready to explore more?</h3>
          <p className="text-muted-foreground">
            Try the comprehensive Color Name Test to see detailed analysis across different color categories
          </p>
        </div>
      </div>
    </div>
  );
};
