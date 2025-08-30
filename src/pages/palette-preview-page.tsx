import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { CSSColorVariablesObject, Palette } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/preview-views/color-preview-card";
import { PaletteSelector } from "@/components/preview-views/palette-preview-selector";
import { PreviewViewType } from "@/components/preview-views/view-selector";
import { cn } from "@/lib/utils";
import { PaletteTabsPreview } from "@/components/palette-tabs-preview";
import { PaletteDBQueries } from "@/db/queries";
import { PaletteUtils } from "@/lib/palette-utils";
import { PaletteNotSelected } from "@/components/preview-views/palette-not-selected";

/**
 * PalettePreviewPage Component
 *
 * A reusable component that displays a preview of UI elements with colors from a palette.
 * Can accept either a Palette object directly or fetch from database using paletteId URL parameter.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {Palette} [props.palette] - Palette object to use for preview
 * @param {Function} [props.onColorsChange] - Callback function that receives the colors whenever they change
 * @param {PreviewViewType} [props.initialView] - Initial view type to display
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {number} [props.previewHeight] - Height for the preview container in pixels
 * @param {string} [props.containerClassName] - Additional CSS classes for the outer container
 *
 * @note The paletteId is now handled via URL search parameters using nuqs (?paletteId=abc123)
 *
 * @example
 * // Usage with palette object
 * <PalettePreviewPage palette={myPalette} />
 *
 * @example
 * // Usage with URL parameter (navigate to /palette-preview?paletteId=abc123)
 * <PalettePreviewPage />
 *
 * @example
 * // Fully customized usage
 * <PalettePreviewPage
 *   palette={myPalette}
 *   onColorsChange={(colors) => console.log('Colors changed:', colors)}
 *   initialView="mobile"
 *   className="my-custom-class"
 *   previewHeight={600}
 * />
 */
interface PalettePreviewPageProps {
  palette?: Palette;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
  initialView?: PreviewViewType;
  className?: string;
  previewHeight?: number;
  containerClassName?: string;
}

export function PalettePreviewPage({
  palette,
  onColorsChange,
  initialView = "desktop",
  className = "",
  previewHeight = 800,
  containerClassName = "",
}: PalettePreviewPageProps) {
  // Use nuqs to handle paletteId from URL search parameters
  const [paletteId] = useQueryState("paletteId", {
    defaultValue: "",
  });

  const [currentPalette, setCurrentPalette] = useState<Palette | undefined>(palette);
  const [currentColors, setCurrentColors] = useState<CSSColorVariablesObject | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Load palette from database if paletteId is provided via URL
  useEffect(() => {
    if (paletteId && paletteId.trim() !== "" && !palette) {
      setIsLoading(true);
      setError(undefined);

      PaletteDBQueries.getPaletteById(paletteId)
        .then((fetchedPalette) => {
          if (fetchedPalette) {
            setCurrentPalette(fetchedPalette);
          } else {
            setError(`Palette with ID "${paletteId}" not found`);
          }
        })
        .catch((err) => {
          setError(`Failed to load palette: ${err.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [paletteId, palette]);

  // Convert palette colors to CSS variables when palette changes
  useEffect(() => {
    if (currentPalette?.colors) {
      const conversionResult = PaletteUtils.colorRolesObjectFromColors(currentPalette.colors);
      if (conversionResult.wasSuccessful) {
        setCurrentColors(conversionResult.colorRolesObject);
        onColorsChange?.(conversionResult.colorRolesObject);
      } else {
        // If role-based conversion fails, still show the palette with basic preview
        setCurrentColors(undefined);
        console.warn('Color roles conversion failed:', conversionResult.errorMessage);
      }
    }
  }, [currentPalette, onColorsChange]);

  // Handle palette selection from selector
  const handlePaletteSelect = (colors: CSSColorVariablesObject) => {
    setCurrentColors(colors);
    onColorsChange?.(colors);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("container mx-auto py-8 flex items-center justify-center", containerClassName)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading palette...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("container mx-auto py-8", containerClassName)}>
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const title = currentPalette?.name || "Color Scheme Preview";

  // Show palette not selected state when no palette is available
  if (!currentPalette && !isLoading && !error) {
    return (
      <div className={cn("container mx-auto py-8", containerClassName)}>
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
          <h1 className="mb-4 text-3xl font-bold md:mb-0">Color Scheme Preview</h1>
          <PaletteSelector onPaletteSelect={handlePaletteSelect} />
        </div>

        <PaletteNotSelected className={className} />
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto py-8", containerClassName)}>
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold md:mb-0">{title}</h1>

        {/* Palette Selection Menu - only show if no specific palette is provided */}
        {!currentPalette && <PaletteSelector onPaletteSelect={handlePaletteSelect} />}
      </div>

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
          title={title}
          initialView={initialView}
          className="lg:col-span-2"
          previewHeight={previewHeight}
          containerClassName=""
        />
      </div>
    </div>
  );
}
