import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolHeroSection } from '@/components/reusable-sections/tool-hero-section';
import { ToolSectionHeading } from '@/components/reusable-sections/tool-section-heading';
import { PalettePreview } from '@/components/palette-preview';
import { useImageColorExtraction } from '@/hooks/use-image-color-extraction';
import { ColorUtils } from '@/lib/color-utils';
import { PaletteUrlUtils } from '@/lib/palette-url-utils';
import { Color } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Camera,
  Sparkles,
  Upload,
  X
} from 'lucide-react';
import { MAX_PALETTE_COLORS } from '@/constants/ui';

export const ImagePaletteExtractorTool: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    colorCount,
    setColorCount,
    isProcessing,
    previewUrl,
    algorithm,
    setAlgorithm,
    extractedColors,
    clearImage,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useImageColorExtraction({
    initialColorCount: 5,
    initialAlgorithm: 'new',
    autoExtractOnUpload: true
  });

  const handleOpenInEditor = () => {
    if (extractedColors.length === 0) return;
    const colorObjects: Color[] = extractedColors.map(hex => ColorUtils.HexToColor(hex));
    navigate(PaletteUrlUtils.generateHexCsvUrl(colorObjects));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Hero Section */}
        <ToolHeroSection
          icon={Camera}
          title="Palette from Image"
          description="Extract colors from any image. You can also extract colors directly in the Palette Editor using the camera icon."
        />

        <div className="space-y-8">
          {/* Algorithm Selection */}
          <div className="space-y-4">
            <RadioGroup value={algorithm} onValueChange={setAlgorithm}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="text-sm cursor-pointer">
                  <div>
                    <div className="font-medium">Advanced Algorithm (Recommended)</div>
                    <div className="text-xs text-muted-foreground">
                      Intelligent analysis with adaptive sampling and color deduplication. Very accurate, but might not get the "vibe" of larger images.
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="old" id="old" />
                <Label htmlFor="old" className="text-sm cursor-pointer">
                  <div>
                    <div className="font-medium">Averaging Algorithm</div>
                    <div className="text-xs text-muted-foreground">
                      Simple K-means clustering - faster but less sophisticated. Gets the general "vibe", as opposed the exact colors.
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Color Count Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Number of colors to extract: {colorCount[0]}
            </Label>
            <Slider
              value={colorCount}
              onValueChange={setColorCount}
              max={MAX_PALETTE_COLORS}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          {/* Color Preview */}
          {extractedColors.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Extracted Colors Preview
              </Label>
              <PalettePreview
                colors={extractedColors.map((hex, index) => ({
                  id: `preview-${index}`,
                  hex,
                  locked: false
                }))}
                height="4rem"
                showTooltips={true}
                borderRadius="lg"
                showBorder={true}
              />
            </div>
          )}

          {/* Image Upload Area */}
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            } ${isProcessing ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-48 max-w-full rounded-lg"
                />
                {!isProcessing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop your image here" : "Upload an image"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to select • PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Extracting colors...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button
              onClick={handleOpenInEditor}
              disabled={extractedColors.length === 0 || isProcessing}
              size="lg"
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Open in Palette Editor
            </Button>
          </div>

        </div>

        <ToolSectionHeading
          title="How to Use"
          description="Upload an image, adjust settings, and extract colors for your palette"
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload any image file (PNG, JPG, GIF, WebP)
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Open in Editor</h3>
            <p className="text-sm text-muted-foreground">
              Click the button to open extracted colors in the full Palette Editor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
