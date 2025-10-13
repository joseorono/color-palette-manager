import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { Palette } from "@/types/palette";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { ColorPreviewCard } from "@/components/palette-preview/color-preview-card";
import { PaletteSelector } from "@/components/palette-preview/palette-preview-selector";
import { PaletteTabsPreview } from "@/components/palette-tabs-preview";
import { PaletteDBQueries } from "@/db/queries";
import { PaletteNotSelected } from "@/components/palette-preview/palette-not-selected";

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
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
          <p className="mb-2 text-lg font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const title = currentPalette?.name || "Color Scheme Preview";

  // Show palette not selected state when no palette is available
  if (!currentPalette && !isLoading && !error) {
    return (
      <div className="container mx-auto px-5 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Color Scheme Preview
          </h1>
        </div>
        <div className="flex justify-center py-3">
          <PaletteSelector currentPalette={currentPalette} />
        </div>
        <PaletteNotSelected />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-between px-5 md:flex-row">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{title}</h1>

        {/* Palette Selection Menu - always show for palette switching */}
        <PaletteSelector currentPalette={currentPalette} />
      </div>

      <div className="grid grid-cols-1 gap-8 px-5 py-5 lg:grid-cols-3">
        <ColorPreviewCard palette={currentPalette} />

        <PaletteTabsPreview
          palette={currentPalette}
          initialView="desktop"
          className="mt-4"
          classNameForViews="h-[800px]"
        />
      </div>
    </div>
  );
}
