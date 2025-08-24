"use client";

import { PaletteDashboard } from "@/components/palette-dashboard";
import { usePalettes } from "@/hooks/use-palettes";
import { toast } from "sonner";

export default function DashboardPage() {
  const { palettes, isLoading, toggleFavorite, deletePalette } = usePalettes();

  const handleCreateNew = () => {
    toast.info("This would open the palette creation modal.");
  };

  const handleEditPalette = (palette: any) => {
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

  const handleViewPalette = (palette: any) => {
    toast.info(`This would open the detailed view for "${palette.name}".`);
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
