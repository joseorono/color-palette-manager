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
    // <div className="w-full flex-shrink-0 md:w-full md:basis-full xl:w-auto xl:basis-auto 2xl:justify-self-start">

    <div className="flex w-full flex-shrink-0 md:basis-auto lg:max-w-60 xl:max-w-96 xl:basis-auto xl:justify-self-start">
      <Button
        onClick={onOpenMetadata}
        variant="ghost"
        className="flex max-w-full items-center gap-3 pl-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Palette className="h-6 w-6 text-gray-500" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="block truncate text-2xl font-medium">{name}</span>
        </div>
        <Pencil className="h-3 w-3 text-gray-400" />
      </Button>
    </div>
  );
}
