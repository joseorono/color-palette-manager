import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PaletteGenerator } from "@/components/palette-generator";
import { usePaletteStore } from "@/stores/palette-store";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/db/main";
import { Color, Palette } from "@/types";
import { PaletteDBQueries } from "@/db/queries";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const { setPaletteFromUrl } = usePaletteStore();

  useEffect( () => {
    try {
      const fetchedData = async () => {
        // const colors = await getAllColors() // TODO: Implement color queries in PaletteDBQueries
        const palettes = await PaletteDBQueries.getAllPalettes()
        // console.log(colors)
        console.log(palettes)
      }
      fetchedData()
    } catch (error) {
      console.log(`Error fetching data: ${error}`)
    }
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
