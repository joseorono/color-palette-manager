import { useEffect } from "react";
import { PaletteGenerator } from "@/components/palette-generator";
import { usePaletteStore } from "@/stores/palette-store";
import { Toaster } from "@/components/ui/sonner";

export default function PaletteEditor() {
  const { loadPaletteFromUrl, hasUnsavedChanges } = usePaletteStore();

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

  // Load palette from URL parameters on component mount
  useEffect(() => {
    // Convert current URL with search params to full URL string
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    loadPaletteFromUrl(currentUrl);
  }, [loadPaletteFromUrl]);


  return (
    <>
      <PaletteGenerator />
      <Toaster />
    </>
  );
}
