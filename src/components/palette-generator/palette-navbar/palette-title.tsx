import { Button } from "@/components/ui/button";
import { Palette, Pencil } from "lucide-react";
import { usePaletteStore } from "@/stores/palette-store";

interface PaletteTitleProps {
  onOpenMetadata: () => void;
}

export function PaletteTitle({ onOpenMetadata }: PaletteTitleProps) {
  const { currentPalette } = usePaletteStore();
  const name = currentPalette?.name || "Untitled Palette";
  return (
    <div className="flex-shrink-0 2xl:justify-self-start">
      <Button
        onClick={onOpenMetadata}
        variant="ghost"
        className="flex items-center gap-3 pl-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Palette className="h-6 w-6 text-gray-500" />
        <div className="flex flex-col">
          <span className="text-2xl font-medium">{name}</span>
        </div>
        <Pencil className="h-3 w-3 text-gray-400" />
      </Button>
    </div>
  );
}
