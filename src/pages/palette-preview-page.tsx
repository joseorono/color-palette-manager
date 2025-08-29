import { useEffect, useState } from "react";
import { CSSColorVariablesObject } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/preview-views/color-preview-card";
import { PaletteSelector } from "@/components/preview-views/palette-preview-selector";
import { PreviewViewType } from "@/components/preview-views/view-selector";
import { cn } from "@/lib/utils";
import { PaletteTabsPreview } from "@/components/palette-tabs-preview";

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
  initialView?: PreviewViewType;
  className?: string;
  previewHeight?: number;
  containerClassName?: string;
}

export function PalettePreviewPage({
  initialColors,
  title = "Color Scheme Preview",
  initialView = "desktop",
  className = "",
  previewHeight = 800,
  containerClassName = "",
}: PropsPreviewProps) {
  const [currentColors, setCurrentColors] = useState<
    CSSColorVariablesObject | undefined
  >(initialColors);

  // Handle palette selection
  const handlePaletteSelect = (colors: CSSColorVariablesObject) => {
    setCurrentColors(colors);
  };

  return (
    <div className={cn("container mx-auto py-8", containerClassName)}>
      {title && (
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
          {title && (
            <h1 className="mb-4 text-3xl font-bold md:mb-0">{title}</h1>
          )}

          {/* Palette Selection Menu */}
          {<PaletteSelector onPaletteSelect={handlePaletteSelect} />}
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-8",
          {
            "lg:grid-cols-3": true,
            "lg:grid-cols-1": !true,
          },
          className
        )}
      >
        {
          <div className="lg:col-span-1">
            <ColorPreviewCard currentColors={currentColors} />
          </div>
        }

        <PaletteTabsPreview
          initialColors={currentColors}
          title="Color Scheme Preview"
          initialView="desktop"
          className="lg:col-span-2"
          previewHeight={800}
          containerClassName=""
        />
      </div>
    </div>
  );
}
