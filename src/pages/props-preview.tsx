import { useEffect, useState } from "react";
import { CSSColorVariablesObject } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/preview-views/color-preview-card";
import { UIPreviewCard } from "@/components/preview-views/ui-preview-card";
import { PaletteSelector } from "@/components/preview-views/palette-preview-selector";
import {
  ViewSelector,
  PreviewViewType,
} from "@/components/preview-views/view-selector";
import { EbookPreviewCard } from "@/components/preview-views/ebook-preview-card";
import { MobileUIPreviewCard } from "@/components/preview-views/mobile-ui-preview-card";
import { cn } from "@/lib/utils";

/**
 * PropsPreview Component
 *
 * A reusable component that displays a preview of UI elements with the provided colors.
 * This component is fully isolated and relies only on props for customization.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {CSSColorVariablesObject} props.initialColors - Initial colors to use for the preview
 * @param {Function} [props.onColorsChange] - Callback function that receives the colors whenever they change
 * @param {string} [props.title] - Custom title for the preview section
 * @param {boolean} [props.showPaletteSelector] - Whether to show the palette selector
 * @param {boolean} [props.showViewSelector] - Whether to show the view type selector
 * @param {boolean} [props.showColorPreview] - Whether to show the color preview card
 * @param {PreviewViewType} [props.initialView] - Initial view type to display
 * @param {Array<PreviewViewType>} [props.availableViews] - Which view types to make available
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {number} [props.previewHeight] - Height for the preview container in pixels
 * @param {string} [props.containerClassName] - Additional CSS classes for the outer container
 *
 * @example
 * // Basic usage with required colors
 * <PropsPreview initialColors={myColors} />
 *
 * @example
 * // Fully customized usage
 * <PropsPreview
 *   initialColors={{ primary: '#ff0000', secondary: '#00ff00', ... }}
 *   onColorsChange={(colors) => console.log('Colors changed:', colors)}
 *   title="My Custom Preview"
 *   showPaletteSelector={false}
 *   showViewSelector={true}
 *   showColorPreview={true}
 *   initialView="mobile"
 *   availableViews={["mobile", "desktop"]}
 *   className="my-custom-class"
 *   previewHeight={600}
 * />
 */
interface PropsPreviewProps {
  initialColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
  title?: string;
  showPaletteSelector?: boolean;
  showViewSelector?: boolean;
  showColorPreview?: boolean;
  initialView?: PreviewViewType;
  availableViews?: PreviewViewType[];
  className?: string;
  previewHeight?: number;
  containerClassName?: string;
}

export function PropsPreview({
  initialColors,
  onColorsChange,
  title = "Color Scheme Preview",
  showPaletteSelector = true,
  showViewSelector = true,
  showColorPreview = false,
  initialView = "desktop",
  availableViews = ["desktop", "ebook", "mobile"],
  className = "",
  previewHeight = 800,
  containerClassName = "",
}: PropsPreviewProps) {
  const [currentView, setCurrentView] = useState<PreviewViewType>(initialView);
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
    <div className={cn("container mx-auto py-8", containerClassName)}>
      {(title || showPaletteSelector) && (
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
          {title && (
            <h1 className="mb-4 text-3xl font-bold md:mb-0">{title}</h1>
          )}

          {/* Palette Selection Menu */}
          {/* {showPaletteSelector && (
            <PaletteSelector onPaletteSelect={handlePaletteSelect} />
          )} */}
        </div>
      )}

      {/* View Selector */}
      {showViewSelector && availableViews.length > 1 && (
        <ViewSelector
          currentView={currentView}
          onViewChange={handleViewChange}
          availableViews={availableViews}
        />
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-8",
          {
            "lg:grid-cols-3": showColorPreview,
            "lg:grid-cols-1": !showColorPreview,
          },
          className
        )}
      >
        {showColorPreview && (
          <div className="lg:col-span-1">
            <ColorPreviewCard currentColors={currentColors} />
          </div>
        )}

        <div className={showColorPreview ? "lg:col-span-2" : "w-full"}>
          <div className="relative" style={{ minHeight: `${previewHeight}px` }}>
            {/* Desktop View */}
            {availableViews.includes("desktop") && (
              <div
                className={`absolute left-0 top-0 w-full transform transition-all duration-200 ease-in-out ${currentView === "desktop" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
              >
                <UIPreviewCard currentColors={currentColors} />
              </div>
            )}
            {/* Ebook View */}
            {availableViews.includes("ebook") && (
              <div
                className={`absolute left-0 top-0 w-full transform transition-all duration-200 ease-in-out ${currentView === "ebook" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
              >
                <EbookPreviewCard currentColors={currentColors} />
              </div>
            )}
            {/* Mobile View */}
            {availableViews.includes("mobile") && (
              <div
                className={`absolute left-0 top-0 flex w-full transform justify-center transition-all duration-200 ease-in-out ${currentView === "mobile" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
              >
                <div className="w-[375px] overflow-hidden rounded-lg border-4 border-gray-800 shadow-lg">
                  <MobileUIPreviewCard currentColors={currentColors} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
