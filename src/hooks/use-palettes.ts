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

  const toggleFavorite = (paletteId: string) => {
    setPalettes((prev) =>
      prev.map((palette) =>
        palette.id === paletteId
          ? { ...palette, isFavorite: !palette.isFavorite }
          : palette
      )
    );
  };

  const deletePalette = (paletteId: string) => {
    setPalettes((prev) => prev.filter((palette) => palette.id !== paletteId));
  };

  return {
    palettes,
    isLoading,
    toggleFavorite,
    deletePalette,
  };
}
