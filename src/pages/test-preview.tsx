import { useEffect, useState } from "react";
import { CSSColorVariablesObject } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/preview-views/color-preview-card";
import { UIPreviewCard } from "@/components/preview-views/ui-preview-card";
import { PaletteSelector } from "@/components/preview-views/palette-preview-selector";
import { ViewSelector, PreviewViewType } from "@/components/preview-views/view-selector";
import { EbookPreviewCard } from "@/components/preview-views/ebook-preview-card";

/**
 * TestPreview Component
 *
 * A component that displays a preview of UI elements with the provided colors.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {CSSColorVariablesObject} props.initialColors - Initial colors to use for the preview
 * @param {Function} [props.onColorsChange] - Callback function that receives the colors
 *   whenever they change. This allows parent components to react to color changes.
 *
 * @example
 * // Basic usage with required colors
 * <TestPreview initialColors={myColors} />
 *
 * @example
 * // With colors and change handler
 * <TestPreview
 *   initialColors={{ primary: '#ff0000', secondary: '#00ff00', ... }}
 *   onColorsChange={(colors) => console.log('Colors changed:', colors)}
 * />
 */
interface TestPreviewProps {
  initialColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function TestPreview({
  initialColors,
  onColorsChange,
}: TestPreviewProps) {
  const [currentView, setCurrentView] = useState<PreviewViewType>("desktop");
  const [currentColors, setCurrentColors] = useState<
    CSSColorVariablesObject | undefined
  >(initialColors);

  // Apply the colors to CSS variables
  useEffect(() => {
    if (currentColors) {
      // Inject colors to CSS variables
      injectColorVariablesObjectToCSS(currentColors);

      // Notify parent component if needed
      if (onColorsChange) {
        onColorsChange(currentColors);
      }
    }
  }, [currentColors, onColorsChange]);

  // Handle palette selection
  const handlePaletteSelect = (colors: CSSColorVariablesObject) => {
    setCurrentColors(colors);
  };

  // Handle view selection
  const handleViewChange = (view: PreviewViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold md:mb-0">
          Color Scheme Preview
        </h1>

        {/* Palette Selection Menu */}
        <PaletteSelector onPaletteSelect={handlePaletteSelect} />
      </div>

      {/* View Selector */}
      <ViewSelector currentView={currentView} onViewChange={handleViewChange} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ColorPreviewCard currentColors={currentColors} />
        </div>

        <div className="lg:col-span-2">
          {currentView === "desktop" && (
            <UIPreviewCard currentColors={currentColors} />
          )}
          {currentView === "ebook" && (
            <EbookPreviewCard currentColors={currentColors} />
          )}
          {currentView === "mobile" && (
            <div className="flex justify-center">
              <div className="w-[375px] overflow-hidden rounded-lg border-4 border-gray-800 shadow-lg">
                <UIPreviewCard currentColors={currentColors} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
