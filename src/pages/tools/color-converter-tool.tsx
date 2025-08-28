import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ColorUtils } from '@/lib/color-utils';
import { HexColorString } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { ToolFeatureCard } from '@/components/reusable-sections/tool-feature-card';
import {
  Palette,
  Sparkles,
  Shuffle,
  Copy,
  RefreshCw
} from 'lucide-react';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
  lab: string;
  name: string;
}

export const ColorConverterTool: React.FC = () => {
  const navigate = useNavigate();
  const [inputColor, setInputColor] = useState<HexColorString>("#3B82F6");
  const [formats, setFormats] = useState<ColorFormats>({
    hex: "",
    rgb: "",
    hsl: "",
    hsv: "",
    cmyk: "",
    lab: "",
    name: ""
  });
  const { copyToClipboard } = useCopyToClipboard();

  // Convert color to all formats when input changes
  useEffect(() => {
    try {
      const allFormats = ColorUtils.getAllColorFormatsFromHex(inputColor);
      setFormats(allFormats);
    } catch (error) {
      console.error('Error converting color:', error);
    }
  }, [inputColor]);


  const handleGeneratePalette = () => {
    navigate(`/app/palette-edit/?basedOnColor=${encodeURIComponent(inputColor)}`);
  };

  const handleRandomColor = () => {
    setInputColor(ColorUtils.generateRandomColorHex());
  };

  const handleInputChange = (value: string) => {
    const parsedColor = ColorUtils.parseAnyColorInputToHex(value);
    if (parsedColor) {
      setInputColor(parsedColor as HexColorString);
    } else if (value.startsWith('#') && value.length <= 7) {
      // Allow partial hex input for user feedback
      setInputColor(value as HexColorString);
    }
  };

  const formatItems = [
    { key: 'hex', label: 'HEX', description: 'Hexadecimal notation', icon: '#' },
    { key: 'rgb', label: 'RGB', description: 'Red, Green, Blue', icon: 'R' },
    { key: 'hsl', label: 'HSL', description: 'Hue, Saturation, Lightness', icon: 'H' },
    { key: 'hsv', label: 'HSV', description: 'Hue, Saturation, Value', icon: 'V' },
    { key: 'cmyk', label: 'CMYK', description: 'Cyan, Magenta, Yellow, Black', icon: 'C' },
    { key: 'lab', label: 'LAB', description: 'Lightness, A*, B*', icon: 'L' },
    { key: 'name', label: 'Name', description: 'Human-readable color name', icon: 'N' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={RefreshCw}
          title="Color Converter"
          description="Convert colors between different formats instantly. Support for HEX, RGB, HSL, HSV, CMYK, LAB, and human-readable names."
        />

        <div className="space-y-8">
          {/* Input Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Input */}
              <div className="space-y-2">
                <Label htmlFor="colorInput">Enter Color (HEX, RGB, HSL, or Color Name)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="colorInput"
                    type="color"
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value as HexColorString)}
                    className="w-20 h-12 p-1 rounded border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={inputColor}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="font-mono text-sm flex-1"
                    placeholder="#3B82F6, rgb(59, 130, 246), blue, etc."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomColor}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Color Preview */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div
                  className="w-20 h-20 rounded-lg shadow-md border-2 border-border"
                  style={{ backgroundColor: inputColor }}
                />
                <div className="flex-1">
                  <div className="font-medium text-lg">{formats.name}</div>
                  <div className="font-mono text-sm text-muted-foreground">{formats.hex}</div>
                  <Badge variant="secondary" className="mt-2">
                    Current Color
                  </Badge>
                </div>
                <Button
                  onClick={handleGeneratePalette}
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Palette
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Results */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Color Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {formatItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{item.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.description}
                        </Badge>
                      </div>
                      <div className="font-mono text-sm bg-background/50 px-2 py-1 rounded border">
                        {formats[item.key as keyof ColorFormats]}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(formats[item.key as keyof ColorFormats])}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <ToolSectionHeading
          title="How to Use"
          description="Convert between different color formats with real-time updates and one-click copying"
        />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 mb-16">
          <ToolFeatureCard
            icon={RefreshCw}
            title="Real-time Conversion"
            description="Instantly converts between all major color formats as you type"
            iconColorClasses="text-blue-600 dark:text-blue-400"
            iconBgColorClasses="bg-blue-100 dark:bg-blue-900"
          />
          <ToolFeatureCard
            icon={Copy}
            title="One-Click Copy"
            description="Copy any color format to your clipboard with a single click"
            iconColorClasses="text-green-600 dark:text-green-400"
            iconBgColorClasses="bg-green-100 dark:bg-green-900"
          />
          <ToolFeatureCard
            icon={Palette}
            title="Multiple Formats"
            description="Supports HEX, RGB, HSL, and named color formats"
            iconColorClasses="text-purple-600 dark:text-purple-400"
            iconBgColorClasses="bg-purple-100 dark:bg-purple-900"
          />
        </div>
      </div>
    </div>
  );
};
