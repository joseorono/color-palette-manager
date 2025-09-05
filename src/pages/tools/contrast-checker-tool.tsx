import React, { useState, useEffect } from 'react';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { ToolFeatureCard } from '@/components/reusable-sections/tool-feature-card';
import { ColorUtils } from '@/lib/color-utils';
import { HexColorString, WCAGContrastLevel } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  Eye,
  Shuffle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Palette,
  Info
} from 'lucide-react';

export const ContrastCheckerTool: React.FC = () => {
  const [textColor, setTextColor] = useState<HexColorString>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<HexColorString>("#FFFFFF");
  const [contrastRatio, setContrastRatio] = useState<number>(21);

  // Calculate contrast when colors change
  useEffect(() => {
    const ratio = ColorUtils.getContrastRatio(textColor, backgroundColor);
    setContrastRatio(ratio);
  }, [textColor, backgroundColor]);

  const handleRandomTextColor = () => {
    setTextColor(ColorUtils.generateRandomColorHex());
  };

  const handleRandomBackgroundColor = () => {
    setBackgroundColor(ColorUtils.generateRandomColorHex());
  };

  const handleSwapColors = () => {
    const temp = textColor;
    setTextColor(backgroundColor);
    setBackgroundColor(temp);
  };

  const getContrastBadge = (ratio: number) => {
    const level = ColorUtils.getAccessibilityLevel(ratio);
    if (level === WCAGContrastLevel.AAA) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          AAA ({ratio.toFixed(2)}:1)
        </Badge>
      );
    } else if (level === WCAGContrastLevel.AA) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          AA ({ratio.toFixed(2)}:1)
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Fail ({ratio.toFixed(2)}:1)
        </Badge>
      );
    }
  };

  // Use existing ColorUtils functions for WCAG compliance
  const normalTextCompliance = {
    aa: ColorUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AA, false),
    aaa: ColorUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AAA, false)
  };
  const largeTextCompliance = {
    aa: ColorUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AA, true),
    aaa: ColorUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AAA, true)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Type}
          title="Text & Background Contrast Checker"
          description="Check if color combinations meet WCAG contrast guidelines for both normal and large text. Ensure your designs are accessible to everyone."
        />

        <div className="space-y-8">
          {/* Color Controls Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Color */}
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value as HexColorString)}
                      className="w-20 h-12 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value as HexColorString)}
                      className="font-mono text-sm flex-1"
                      placeholder="#000000"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomTextColor}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ColorUtils.getColorName(textColor)}
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value as HexColorString)}
                      className="w-20 h-12 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value as HexColorString)}
                      className="font-mono text-sm flex-1"
                      placeholder="#FFFFFF"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomBackgroundColor}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ColorUtils.getColorName(backgroundColor)}
                  </div>
                </div>
              </div>

              {/* Swap Colors Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleSwapColors}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Swap Colors
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview Samples */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Normal Text Preview */}
                <div className="space-y-3">
                  <Label>Normal Text (16px)</Label>
                  <div
                    className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                    style={{ backgroundColor: backgroundColor }}
                  >
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: textColor }}
                    >
                      The quick brown fox jumps over the lazy dog. This is a sample of normal text at 16px size to test readability and contrast.
                    </p>
                  </div>
                </div>

                {/* Large Text Preview */}
                <div className="space-y-3">
                  <Label>Large Text (18px+)</Label>
                  <div
                    className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                    style={{ backgroundColor: backgroundColor }}
                  >
                    <h2
                      className="text-xl font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      Large Heading
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: textColor }}
                    >
                      This is large text at 18px+ size for testing accessibility compliance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contrast Results Card */}
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Contrast Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Contrast Ratio */}
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">
                  {contrastRatio.toFixed(2)}:1
                </div>
                <div className="text-muted-foreground">Contrast Ratio</div>
                <div className="flex justify-center">
                  {getContrastBadge(contrastRatio)}
                </div>
              </div>

              <Separator />

              {/* WCAG Compliance Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Normal Text Compliance */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Normal Text (16px)
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AA (4.5:1):</span>
                        <Badge
                          variant={normalTextCompliance.aa ? "default" : "destructive"}
                          className={normalTextCompliance.aa ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        >
                          {normalTextCompliance.aa ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Pass</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />Fail</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AAA (7:1):</span>
                        <Badge
                          variant={normalTextCompliance.aaa ? "default" : "destructive"}
                          className={normalTextCompliance.aaa ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        >
                          {normalTextCompliance.aaa ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Pass</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />Fail</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Large Text Compliance */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Large Text (18px+)
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AA (3:1):</span>
                        <Badge
                          variant={largeTextCompliance.aa ? "default" : "destructive"}
                          className={largeTextCompliance.aa ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        >
                          {largeTextCompliance.aa ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Pass</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />Fail</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AAA (4.5:1):</span>
                        <Badge
                          variant={largeTextCompliance.aaa ? "default" : "destructive"}
                          className={largeTextCompliance.aaa ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        >
                          {largeTextCompliance.aaa ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Pass</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" />Fail</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <ToolSectionHeading
          title="Understanding WCAG Guidelines"
          description="Learn about accessibility standards and how to create inclusive designs"
        />

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 mb-16">
          <ToolFeatureCard
            icon={CheckCircle}
            title="WCAG AA Compliance"
            description="Minimum standard for web accessibility. Normal text needs 4.5:1 contrast, large text needs 3:1 contrast ratio."
            iconColorClasses="text-green-600 dark:text-green-400"
            iconBgColorClasses="bg-green-100 dark:bg-green-900"
          />
          <ToolFeatureCard
            icon={Eye}
            title="WCAG AAA Compliance"
            description="Enhanced accessibility standard. Normal text needs 7:1 contrast, large text needs 4.5:1 contrast ratio."
            iconColorClasses="text-blue-600 dark:text-blue-400"
            iconBgColorClasses="bg-blue-100 dark:bg-blue-900"
          />
        </div>
      </div>
    </div>
  );
};
