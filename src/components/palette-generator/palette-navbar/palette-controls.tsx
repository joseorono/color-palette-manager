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
import { usePaletteStore } from "@/stores/palette-store";
import { useState, useEffect, useCallback } from "react";
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

  // Calculate minimum palette size based on locked colors
  const getMinPaletteSize = useCallback(() => {
    const lockedColors =
      currentPalette?.colors.filter((color) => color.locked) || [];
    const lockedCount = lockedColors.length;
    // If there are locked colors, minimum size is the number of locked colors
    // Otherwise, minimum is 1 (default)
    return lockedCount ? lockedCount : 1;
  }, [currentPalette]);

  const minPaletteSize = getMinPaletteSize();

  useEffect(() => {
    setPaletteSize(currentPalette?.colors.length || 5);
    if (paletteSize < minPaletteSize) {
      setPaletteSize(minPaletteSize);
    }
  }, [currentPalette, minPaletteSize, paletteSize]);

  const handleSizeChange = (value: number[]) => {
    let newSize = value[0];
    const currentSize = currentPalette?.colors.length || 0;

    // Count locked colors
    const lockedColors =
      currentPalette?.colors.filter((color) => color.locked) || [];
    const lockedCount = lockedColors.length;

    // If there are more than 3 locked colors, ensure we don't go below that number
    const minSize = lockedCount ? lockedCount : 1;

    // Adjust newSize if it's below the minimum
    if (newSize < minSize) {
      newSize = minSize;
      // Update the slider value visually
      setPaletteSize(minSize);
      return; // Exit early since we can't reduce below the minimum
    }

    if (newSize > currentSize) {
      // Adding colors - use addHarmoniousColor to maintain harmony
      const colorsToAdd = newSize - currentSize;
      for (let i = 0; i < colorsToAdd; i++) addHarmoniousColor();
    } else if (newSize < currentSize) {
      // Removing colors - prioritize removing unlocked colors first
      const colorsToRemove = currentSize - newSize;

      // Get indices of unlocked colors first, then locked colors
      const unlockedIndices = currentPalette.colors
        .map((color, index) => ({ index, locked: !!color.locked }))
        .filter((item) => !item.locked)
        .map((item) => item.index)
        .reverse(); // Start from the end

      // Only include locked indices if we absolutely need to (which shouldn't happen with our min check)
      const lockedIndices = currentPalette.colors
        .map((color, index) => ({ index, locked: !!color.locked }))
        .filter((item) => item.locked)
        .map((item) => item.index)
        .reverse(); // Start from the end

      // Combine them, prioritizing unlocked colors for removal
      const removalOrder = [...unlockedIndices, ...lockedIndices];

      // Calculate how many colors we can actually remove (don't go below locked count)
      const maxRemovable = Math.min(colorsToRemove, currentSize - lockedCount);

      // Remove colors in the determined order, but only up to maxRemovable
      for (let i = 0; i < maxRemovable && i < removalOrder.length; i++) {
        removeColor(removalOrder[i]);
      }
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
          min={minPaletteSize}
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
              <Button size="sm" className="h-9 gap-2 px-2 lg:hidden">
                <Grid3X3 className="h-4 w-4" />
                <span>Adjust palette size</span>
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
              min={minPaletteSize}
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
