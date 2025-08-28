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
import { 
  Palette, 
  Sparkles, 
  Shuffle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { colord } from 'colord';
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
      const color = colord(inputColor);
      
      // Get all color format conversions
      const rgb = color.toRgb();
      const hsl = color.toHsl();
      const hsv = color.toHsv();
      // LAB conversion using manual calculation since colord doesn't have toLab
      const labValues = rgbToLab(rgb.r, rgb.g, rgb.b);
      
      // Calculate CMYK manually since colord doesn't have native CMYK
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      
      setFormats({
        hex: color.toHex().toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
        hsv: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        lab: `lab(${Math.round(labValues.l)}, ${Math.round(labValues.a)}, ${Math.round(labValues.b)})`,
        name: ColorUtils.getColorName(inputColor)
      });
    } catch (error) {
      console.error('Error converting color:', error);
    }
  }, [inputColor]);

  // Helper function to convert RGB to LAB
  const rgbToLab = (r: number, g: number, blue: number) => {
    // Convert RGB to XYZ first
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = blue / 255;

    // Apply gamma correction
    rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
    gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
    bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

    // Convert to XYZ using sRGB matrix
    const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
    const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
    const z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;

    // Normalize for D65 illuminant
    const xn = x / 0.95047;
    const yn = y / 1.00000;
    const zn = z / 1.08883;

    // Convert XYZ to LAB
    const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
    const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
    const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);

    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bStar = 200 * (fy - fz);

    return { l, a, b: bStar };
  };

  // Helper function to convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rPercent = r / 255;
    const gPercent = g / 255;
    const bPercent = b / 255;
    
    const k = 1 - Math.max(rPercent, gPercent, bPercent);
    const c = k === 1 ? 0 : (1 - rPercent - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gPercent - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bPercent - k) / (1 - k);
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const handleGeneratePalette = () => {
    navigate(`/app/palette-edit/?basedOnColor=${encodeURIComponent(inputColor)}`);
  };

  const handleRandomColor = () => {
    setInputColor(ColorUtils.generateRandomColorHex());
  };

  const handleInputChange = (value: string) => {
    try {
      // Try to parse the input as a color
      const color = colord(value);
      if (color.isValid()) {
        setInputColor(color.toHex() as HexColorString);
      }
    } catch (error) {
      // If parsing fails, still update the input for user feedback
      if (value.startsWith('#') && value.length <= 7) {
        setInputColor(value as HexColorString);
      }
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

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Conversion</h3>
            <p className="text-sm text-muted-foreground">
              Instantly converts between all major color formats as you type
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <Copy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">One-Click Copy</h3>
            <p className="text-sm text-muted-foreground">
              Copy any color format to clipboard with a single click
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Input Types</h3>
            <p className="text-sm text-muted-foreground">
              Accepts HEX, RGB, HSL values, and even color names as input
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
