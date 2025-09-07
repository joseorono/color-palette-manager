import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DebouncedSlider } from "@/components/ui/debounced-slider";
import SplitButton from "@/components/shadcn-blocks/split-button";
import { Shuffle, Sliders, Undo, Plus, Camera, Grid3X3 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { usePaletteStore } from "@/stores/palette-store";
import { useState, useEffect } from "react";
import { MAX_PALETTE_COLORS } from "@/constants/ui";

interface PaletteControlsProps {
  onOpenGenerationMethod: () => void;
  onOpenUpload: () => void;
}

export function PaletteControls({
  onOpenGenerationMethod,
  onOpenUpload,
}: PaletteControlsProps) {
  const {
    currentPalette,
    isGenerating,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
    addHarmoniousColor,
    removeColor,
  } = usePaletteStore();

  const [paletteSize, setPaletteSize] = useState<number>(
    currentPalette?.colors.length || 5
  );
  const [isSizeControlOpen, setIsSizeControlOpen] = useState(false);

  useEffect(() => {
    setPaletteSize(currentPalette?.colors.length || 5);
  }, [currentPalette]);

  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    const currentSize = currentPalette?.colors.length || 0;

    if (newSize > currentSize) {
      const colorsToAdd = newSize - currentSize;
      for (let i = 0; i < colorsToAdd; i++) addHarmoniousColor();
    } else if (newSize < currentSize) {
      const colorsToRemove = currentSize - newSize;
      for (let i = 0; i < colorsToRemove; i++) removeColor(currentSize - 1 - i);
    }

    setPaletteSize(newSize);
  };

  return (
    <div className="flex snap-x snap-mandatory items-center justify-around px-1 2xl:gap-1 2xl:justify-self-center">
      {/* Generate New */}
      <Tooltip>
        <TooltipTrigger asChild>
          <SplitButton
            mainButtonText=""
            mainButtonIcon={Shuffle}
            onMainButtonClick={() =>
              generateNewPalette(currentPalette?.colors.length)
            }
            menuItems={[
              {
                id: "generate-new",
                label: "Generate New Palette",
                icon: Shuffle,
                onClick: () =>
                  generateNewPalette(currentPalette?.colors.length),
              },
              {
                id: "generation-method",
                label: "Select Generation Method",
                icon: Sliders,
                onClick: onOpenGenerationMethod,
              },
            ]}
            variant="ghost"
            size="sm"
            dropdownButtonClassName="h-9 w-9"
            mainButtonClassName="h-9 w-9"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate new palette</p>
        </TooltipContent>
      </Tooltip>

      {/* Regenerate Unlocked */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={regenerateUnlocked}
            disabled={!!isGenerating}
            variant="ghost"
            size="sm"
            className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
          >
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Regenerate unlocked colors</p>
        </TooltipContent>
      </Tooltip>

      {/* Palette Size Control */}
      <div className="hidden px-1 shadow-sm lg:block 2xl:px-2">
        <DebouncedSlider
          value={[paletteSize]}
          onChange={handleSizeChange}
          debounce={500}
          max={MAX_PALETTE_COLORS}
          min={2}
          step={1}
          className="w-40 cursor-grab 2xl:w-32"
        />
      </div>

      <DropdownMenu
        open={isSizeControlOpen}
        onOpenChange={setIsSizeControlOpen}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="block h-9 w-9 lg:hidden"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adjust palette size</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="center" className="w-64 p-4">
          <div className="space-y-2">
            <DebouncedSlider
              value={[paletteSize]}
              onChange={handleSizeChange}
              debounce={300}
              max={MAX_PALETTE_COLORS}
              min={2}
              step={1}
              className="w-full"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={addColor}
            variant="ghost"
            size="sm"
            className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
            disabled={
              !currentPalette ||
              currentPalette.colors.length >= MAX_PALETTE_COLORS
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new color (Shift + A)</p>
        </TooltipContent>
      </Tooltip>

      {/* Extract from Image */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpenUpload}
            variant="ghost"
            size="sm"
            className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Extract colors from image</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
