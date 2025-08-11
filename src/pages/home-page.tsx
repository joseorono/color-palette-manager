import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PaletteGenerator } from "@/components/palette-generator";
import { usePaletteStore } from "@/stores/palette-store";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/db/main";
import { Palette } from "@/types";
import { getAllPalettes } from "@/db/utils";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const { setPaletteFromUrl } = usePaletteStore();

  async function addPalette() {
    const id = await db.palettes.add({
      name: "New Palette",
      description: "Description",
      colors: [{ hex: "#FF0000", locked: false }, { hex: "#00FF00", locked: false }, { hex: "#0000FF", locked: false }],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      tags: [],
      favoriteCount: 0,
      isFavorite: false,
    });
    console.log(id);
  }
  
  useEffect(() => {
    getAllPalettes().then((palettes: Palette[]) => console.log(palettes))
    // Check for shared palette in URL
    const colorsParam = searchParams.get("colors");
    if (colorsParam) {
      const colors = colorsParam
        .split(",")
        .map((color) => (color.startsWith("#") ? color : `#${color}`));
      if (colors.length > 0) {
        setPaletteFromUrl(colors);
      }
    }
  }, [searchParams, setPaletteFromUrl]);

  return (
    <>
      <PaletteGenerator />
      <Toaster />
    </>
  );
}
