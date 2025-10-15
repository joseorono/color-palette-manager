"use client";

import { useState, useEffect } from "react";
import type { Palette } from "@/types/palette";
import { PaletteDBQueries } from "@/db/queries";

export function usePalettes() {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadPalettes = async () => {
      const paletteDBData = await PaletteDBQueries.getAllPalettes();
      setIsLoading(true);
      // Wait so we can actually see the loading state
      //await new Promise((resolve) => setTimeout(resolve, 100));
      setPalettes(paletteDBData);
      setIsLoading(false);
    };

    loadPalettes();
  }, []);

  const toggleFavorite = async (paletteId: string) => {
    // Find the palette to get its current state
    const palette = palettes.find((p) => p.id === paletteId);
    if (!palette) return;

    // Update local state immediately for better UX
    setPalettes((prev) =>
      prev.map((p) =>
        p.id === paletteId
          ? { ...p, isFavorite: !p.isFavorite }
          : p
      )
    );

    // Persist to database
    try {
      await PaletteDBQueries.updatePalette(paletteId, {
        ...palette,
        isFavorite: !palette.isFavorite,
      });
    } catch (error) {
      // Revert on error
      setPalettes((prev) =>
        prev.map((p) =>
          p.id === paletteId
            ? { ...p, isFavorite: palette.isFavorite }
            : p
        )
      );
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deletePalette = async (paletteId: string) => {
    // Update local state immediately for better UX
    setPalettes((prev) => prev.filter((palette) => palette.id !== paletteId));

    // Delete from database
    try {
      await PaletteDBQueries.deletePalette(paletteId);
    } catch (error) {
      // Reload palettes on error to restore state
      const paletteDBData = await PaletteDBQueries.getAllPalettes();
      setPalettes(paletteDBData);
      console.error("Failed to delete palette:", error);
      throw error; // Re-throw so the caller can handle it
    }
  };

  return {
    palettes,
    isLoading,
    toggleFavorite,
    deletePalette,
  };
}
