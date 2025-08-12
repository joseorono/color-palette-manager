import React, { useEffect, useCallback, useMemo } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorCard } from "./color-card";
import { PaletteControls } from "./palette-controls";
import { ExportModal } from "./dialogs/export-modal";
import { Button } from "./ui/button";
import { Shuffle, Plus } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Color } from "@/types/palette";
import { getEmptyImage } from "react-dnd-html5-backend";

interface DragItem {
  type: string;
  index: number;
  color: Color;
}

interface DraggableColorCardProps {
  color: Color;
  index: number;
  moveColor: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableColorCard = React.memo(({ color, index, moveColor }: DraggableColorCardProps) => {
  // Memoize drag configuration to prevent recreation on every render
  const dragConfig = useMemo(() => ({
    type: "color",
    item: { type: "color", index, color },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [index, color]);
  
  // Memoize drop configuration
  const dropConfig = useMemo(() => ({
    accept: "color",
    drop: (item: DragItem) => {
      // Only move the item when it's actually dropped
      if (item.index !== index) {
        moveColor(item.index, index);
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }), [index, moveColor]);
  
  const [{ isDragging }, drag, preview] = useDrag(dragConfig);
  const [{ isOver }, drop] = useDrop(dropConfig);
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  
  return (
    <ColorCard
      color={color}
      index={index}
      isDragging={isDragging}
      isOver={isOver}
      dragRef={drag}
      dropRef={drop}
    />
  );
});

// Add display name for better debugging
DraggableColorCard.displayName = 'DraggableColorCard';

export function PaletteGenerator() {
  const {
    currentPalette,
    isGenerating,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
    reorderColors,
  } = usePaletteStore();

  const moveColor = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      reorderColors(dragIndex, hoverIndex);
    },
    [reorderColors]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        regenerateUnlocked();
      }
    },
    [regenerateUnlocked]
  );

  useEffect(() => {
    // Generate initial palette
    if (currentPalette.length === 0) {
      generateNewPalette();
    }

    // Add keyboard listeners
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, generateNewPalette, currentPalette.length]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              Color Palette Generator
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Create beautiful color palettes with ease. Press spacebar to
              generate new colors.
            </p>

            <div className="mb-8 flex justify-center gap-4">
              <Button
                onClick={() => generateNewPalette()}
                disabled={isGenerating}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Generate New
              </Button>

              <Button
                onClick={addColor}
                variant="outline"
                disabled={currentPalette.length >= 16}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            </div>
          </div>

          {/* Palette Display */}
          <div className="mx-auto mb-8 max-w-6xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-2">
              {currentPalette.map((color, index) => (
                <DraggableColorCard
                  key={`${color.hex}-${index}`}
                  color={color}
                  index={index}
                  moveColor={moveColor}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <PaletteControls />

          {/* Export Modal */}
          <ExportModal />
        </div>
      </div>
    </DndProvider>
  );
}
