import React, { useState, useMemo } from 'react';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { ToolFeatureCard } from '@/components/reusable-sections/tool-feature-card';
import { AccessibilityUtils } from '@/lib/accessibility-utils';
import { ColorBlindnessType } from '@/types/accessibility';
import { ColorUtils } from '@/lib/color-utils';
import { PalettePreview } from '@/components/palette-preview';
import { HexColorString } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Eye,
  EyeOff,
  Shuffle,
  Info,
  Users,
  Palette,
  ArrowRight,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

export const ColorBlindnessSimulatorTool: React.FC = () => {
  // State for palette colors
  const [paletteColors, setPaletteColors] = useState<HexColorString[]>([
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"
  ]);

  // State for vision simulation
  const [selectedVisionType, setSelectedVisionType] = useState<ColorBlindnessType>(ColorBlindnessType.DEUTERANOPIA);
  const [severity, setSeverity] = useState<number>(1.0);

  // State for palette input
  const [paletteInput, setPaletteInput] = useState<string>("");

  // Simulate colors for palette preview
  const simulatedHex = useMemo(() => {
    return AccessibilityUtils.simulateColorBlindnessForPalette(paletteColors, selectedVisionType, severity);
  }, [paletteColors, selectedVisionType, severity]);

  // Convert hex colors to Color objects for PalettePreview
  const originalColors = useMemo(() => {
    return paletteColors.map(hex => ColorUtils.HexToColor(hex));
  }, [paletteColors]);

  const simulatedColors = useMemo(() => {
    return simulatedHex.map(hex => ColorUtils.HexToColor(hex));
  }, [paletteColors, selectedVisionType, severity]);

  // Get information about the selected vision type
  const visionInfo = AccessibilityUtils.getColorBlindnessInfo(selectedVisionType);

  // Check if severity adjustment is supported
  const supportsSeverity = AccessibilityUtils.supportsSeverityAdjustment(selectedVisionType);

  // Handle vision type change
  const handleVisionTypeChange = (value: string) => {
    setSelectedVisionType(value as ColorBlindnessType);
  };

  // Handle severity change
  const handleSeverityChange = (value: number[]) => {
    setSeverity(value[0]);
  };

  // Generate random palette
  const handleGenerateRandomPalette = () => {
    const newColors = Array.from({ length: 12 }, () => ColorUtils.generateRandomColorHex());
    setPaletteColors(newColors);
  };






  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Eye}
          title="Color Blindness Simulator"
          description="Simulate how your color palettes appear to people with different types of color vision deficiencies. Ensure your designs are accessible to everyone."
        />

        {/* Controls Section - Desktop: Side by side, Mobile: Stacked */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulation Controls */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  Vision Simulation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Vision Type Selection */}
                <div className="space-y-3">
                  <Label htmlFor="vision-type" className="text-sm font-medium">Vision Type</Label>
                  <Select value={selectedVisionType} onValueChange={handleVisionTypeChange}>
                    <SelectTrigger id="vision-type" className="w-full">
                      <SelectValue placeholder="Select vision type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Normal Vision</SelectLabel>
                        <SelectItem value={ColorBlindnessType.NORMAL}>Trichromatic (Normal)</SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Anomalous Trichromacy</SelectLabel>
                        <SelectItem value={ColorBlindnessType.PROTANOMALY}>Protanomaly (Red-Weak)</SelectItem>
                        <SelectItem value={ColorBlindnessType.DEUTERANOMALY}>Deuteranomaly (Green-Weak)</SelectItem>
                        <SelectItem value={ColorBlindnessType.TRITANOMALY}>Tritanomaly (Blue-Weak)</SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Dichromacy</SelectLabel>
                        <SelectItem value={ColorBlindnessType.PROTANOPIA}>Protanopia (No Red)</SelectItem>
                        <SelectItem value={ColorBlindnessType.DEUTERANOPIA}>Deuteranopia (No Green)</SelectItem>
                        <SelectItem value={ColorBlindnessType.TRITANOPIA}>Tritanopia (No Blue)</SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Monochromacy</SelectLabel>
                        <SelectItem value={ColorBlindnessType.ACHROMATOPSIA}>Achromatopsia (Complete)</SelectItem>
                        <SelectItem value={ColorBlindnessType.BLUE_CONE_MONOCHROMACY}>Blue Cone Monochromacy</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vision Type Info */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">{visionInfo.name}</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{visionInfo.description}</p>
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        ~{visionInfo.prevalence} affected
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Severity Slider (only for anomalous trichromacy) */}
                {supportsSeverity && (
                  <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="severity" className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Severity Level
                      </Label>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">
                        {Math.round(severity * 100)}%
                      </span>
                    </div>
                    <Slider
                      id="severity"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[severity]}
                      onValueChange={handleSeverityChange}
                      className="w-full"
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      0% = normal vision • 100% = full deficiency
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Palette Input */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5 text-primary" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="palette-input" className="text-sm font-medium">Colors (hex values)</Label>
                  <Textarea
                    id="palette-input"
                    placeholder="Enter hex colors (e.g., #FF5733)&#10;One color per line&#10;Maximum 12 colors"
                    value={paletteInput}
                    onChange={(e) => setPaletteInput(e.target.value)}
                    className="min-h-[140px] font-mono text-sm resize-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleGenerateRandomPalette}
                    variant="outline"
                    className="flex items-center justify-center gap-2 flex-1 hover:bg-primary/5"
                  >
                    <Shuffle className="h-4 w-4" />
                    Generate Random
                  </Button>
                </div>

                {paletteColors.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {paletteColors.length} color{paletteColors.length !== 1 ? 's' : ''} loaded
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Palette Comparison */}
        {paletteColors.length > 0 && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vision Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Normal Vision */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Label className="text-base font-medium">Normal Vision</Label>
                    </div>
                    <PalettePreview
                      colors={originalColors}
                      height="4rem"
                      showTooltips={true}
                      showColorNames={false}
                      enableCopyOnClick={true}
                    />
                    <div className="text-xs text-muted-foreground">
                      How colors appear to people with normal trichromatic vision
                    </div>
                </div>

                {/* Simulated Vision */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-orange-600" />
                    <Label className="text-base font-medium">{visionInfo.name}</Label>
                  </div>
                  <PalettePreview
                    colors={simulatedColors}
                    height="4rem"
                    showTooltips={true}
                    showColorNames={false}
                    enableCopyOnClick={true}
                  />
                  <div className="text-xs text-muted-foreground">
                    How the same colors appear to people with {visionInfo.name.toLowerCase()}
                  </div>
                </div>
              </div>

              {/* Color Comparison Grid */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Individual Color Comparison</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {paletteColors.map((originalHex: string, index: number) => {
                    const simulatedHex = AccessibilityUtils.simulateColorBlindness(
                      originalHex,
                      selectedVisionType,
                      severity
                    );

                    return (
                      <div key={index} className="space-y-2">
                        {/* Original Color */}
                        <div
                          className="h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: originalHex }}
                          title={`Original: ${originalHex.toUpperCase()}`}
                        />

                        {/* Arrow */}
                        <div className="flex justify-center">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </div>

                        {/* Simulated Color */}
                        <div
                          className="h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: simulatedHex }}
                          title={`${visionInfo.name}: ${simulatedHex.toUpperCase()}`}
                        />

                        {/* Color Names */}
                        <div className="text-xs text-center space-y-1">
                          <div className="font-medium">{ColorUtils.getColorName(originalHex)}</div>
                          <div className="text-muted-foreground">
                            {ColorUtils.getColorName(simulatedHex)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          </section>
        )}

      {/* Educational Features Section */}
      <section className="mb-8">
        <ToolSectionHeading
          title="Understanding Color Vision Deficiencies"
          description="Learn about different types of color blindness and how they affect color perception"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <ToolFeatureCard
            icon={Eye}
            title="Anomalous Trichromacy"
            description="Color weakness where one type of cone cell has shifted sensitivity. Includes protanomaly (red-weak), deuteranomaly (green-weak), and tritanomaly (blue-weak)."
            iconColorClasses="text-yellow-600 dark:text-yellow-400"
            iconBgColorClasses="bg-yellow-100 dark:bg-yellow-900"
          />
          <ToolFeatureCard
            icon={EyeOff}
            title="Dichromacy"
            description="Complete absence of one type of cone cell. Includes protanopia (no L-cones), deuteranopia (no M-cones), and tritanopia (no S-cones)."
            iconColorClasses="text-orange-600 dark:text-orange-400"
            iconBgColorClasses="bg-orange-100 dark:bg-orange-900"
          />
          <ToolFeatureCard
            icon={Users}
            title="Monochromacy"
            description="Severe color vision deficiency. Achromatopsia (complete color blindness) and blue cone monochromacy affect less than 0.01% of the population."
            iconColorClasses="text-red-600 dark:text-red-400"
            iconBgColorClasses="bg-red-100 dark:bg-red-900"
          />
          <ToolFeatureCard
            icon={Lightbulb}
            title="Design Guidelines"
            description="Use sufficient contrast, avoid relying solely on color, provide alternative indicators, and test with multiple vision types."
            iconColorClasses="text-blue-600 dark:text-blue-400"
            iconBgColorClasses="bg-blue-100 dark:bg-blue-900"
          />
          <ToolFeatureCard
            icon={CheckCircle2}
            title="Accessibility Testing"
            description="Regular testing with color blindness simulators helps ensure your designs are accessible to the 8% of men and 0.5% of women with color vision deficiencies."
            iconColorClasses="text-green-600 dark:text-green-400"
            iconBgColorClasses="bg-green-100 dark:bg-green-900"
          />
          <ToolFeatureCard
            icon={Info}
            title="Scientific Accuracy"
            description="Our simulator uses research-based transformation matrices from Brettel, Viénot & Mollon, and Machado et al. for accurate color vision simulation."
            iconColorClasses="text-purple-600 dark:text-purple-400"
            iconBgColorClasses="bg-purple-100 dark:bg-purple-900"
          />
        </div>
      </section>
      </div>
    </div>
  );
};
