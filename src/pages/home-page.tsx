import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PaletteGenerator } from "@/components/palette-generator";
import { usePaletteStore } from "@/stores/palette-store";
import { Toaster } from "@/components/ui/sonner";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const { setPaletteFromUrl } = usePaletteStore();

  useEffect(() => {
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
