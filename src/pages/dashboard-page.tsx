"use client";

import { PaletteDashboard } from "@/components/palette-dashboard";
import { usePalettes } from "@/hooks/use-palettes";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Palette } from "@/types/palette";

export default function DashboardPage() {
  const { palettes, isLoading, toggleFavorite, deletePalette } = usePalettes();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    toast.info("This would open the palette creation modal.");
  };

  const handleEditPalette = (palette: Palette) => {
    toast.info(`This would open the editor for "${palette.name}".`);
  };

  const handleDeletePalette = async (paletteId: string) => {
    const palette = palettes.find((p: { id: string }) => p.id === paletteId);
    if (palette) {
      await deletePalette(paletteId);
      toast.success(`"${palette.name}" has been deleted.`);
    }
  };

  const handleToggleFavorite = (paletteId: string) => {
    const palette = palettes.find((p: { id: string }) => p.id === paletteId);
    if (palette) {
      toggleFavorite(paletteId);
      toast.success(
        `"${palette.name}" ${palette.isFavorite ? "removed from" : "added to"} favorites.`
      );
    }
  };

  const handleViewPalette = (palette: Palette) => {
    // For now, I'm just using the editor.
    // Change the code to use the Viewer once it's implemented.
    const viewUrl = PaletteUrlUtils.generatePaletteIdUrl(palette.id);
    navigate(viewUrl);
  };

  return (
    <section className="container mx-auto max-w-screen-xl py-8">
      <PaletteDashboard
        palettes={palettes}
        isLoading={isLoading}
        onCreateNew={handleCreateNew}
        onEditPalette={handleEditPalette}
        onDeletePalette={handleDeletePalette}
        onToggleFavorite={handleToggleFavorite}
        onViewPalette={handleViewPalette}
      />
    </section>
  );
}
