import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { Palette } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/preview-views/color-preview-card";
import { PaletteSelector } from "@/components/preview-views/palette-preview-selector";
import { PaletteTabsPreview } from "@/components/palette-tabs-preview";
import { PaletteDBQueries } from "@/db/queries";
import { PaletteNotSelected } from "@/components/preview-views/palette-not-selected";

/**
 * PalettePreviewPage Component
 *
 * A standalone page component that displays a preview of UI elements with colors from a palette.
 * Fetches palette data from database using paletteId URL parameter and derives all necessary
 * properties from the palette itself.
 *
 * @component
 *
 * @note The paletteId is handled via URL search parameters using nuqs (?paletteId=abc123)
 *
 * @example
 * // Usage with URL parameter (navigate to /palette-preview?paletteId=abc123)
 * <PalettePreviewPage />
 */

export function PalettePreviewPage() {
  // Use nuqs to handle paletteId from URL search parameters
  const [paletteId] = useQueryState("paletteId", {
    defaultValue: "",
  });

  const [currentPalette, setCurrentPalette] = useState<Palette | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Load palette from database if paletteId is provided via URL
  useEffect(() => {
    if (paletteId && paletteId.trim() !== "") {
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
  }, [paletteId]);


  // Handle palette selection from selector
  const handlePaletteSelect = () => {
    // This function is kept for the PaletteSelector component compatibility
    // but we don't need to store the colors in state anymore
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
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
      <div className="container mx-auto py-8">
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
      <div className="container mx-auto py-8">
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
          <h1 className="mb-4 text-3xl font-bold md:mb-0">Color Scheme Preview</h1>
          <PaletteSelector onPaletteSelect={handlePaletteSelect} />
        </div>

        <PaletteNotSelected />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold md:mb-0">{title}</h1>

        {/* Palette Selection Menu - only show if no specific palette is provided */}
        {!currentPalette && <PaletteSelector onPaletteSelect={handlePaletteSelect} />}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ColorPreviewCard palette={currentPalette} />
        </div>

        <PaletteTabsPreview
          palette={currentPalette}
          initialView="desktop"
          className="lg:col-span-2"
          previewHeight={800}
          containerClassName=""
        />
      </div>
    </div>
  );
}
