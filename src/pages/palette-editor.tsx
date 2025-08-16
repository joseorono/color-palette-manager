import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PaletteGenerator } from "@/components/palette-generator";
import { usePaletteStore } from "@/stores/palette-store";
import { Toaster } from "@/components/ui/sonner";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";

export default function PaletteEditor() {
  const [searchParams] = useSearchParams();
  const { setPaletteFromUrl, hasUnsavedChanges } = usePaletteStore();

  // Handle exit warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        // Deprecated, but doesn't hurt and aids legacy browser support
        // @ts-ignore
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // 
  useEffect(() => {
    const loadPaletteFromUrl = async () => {
      const palette = await PaletteUrlUtils.paletteFromUrlParams(searchParams);
      if (palette) {
        setPaletteFromUrl(palette.colors.map((color) => color.hex));
      }
    };

    loadPaletteFromUrl();
  }, []);


  return (
    <>
      <PaletteGenerator />
      <Toaster />
    </>
  );
}
