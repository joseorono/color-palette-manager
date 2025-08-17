import React, { useEffect, useCallback, useState } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorCard } from "./color-card";
import { PaletteControls } from "./palette-controls";
import { ExportModal } from "./dialogs/export-modal";
import { Button } from "./ui/button";
import { Shuffle, Plus } from "lucide-react";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

export function PaletteGenerator() {
  const {
    currentPalette,
    isGenerating,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
    reorderColors,
  } = usePaletteStore();

  const [activeId, setActiveId] = useState<string | null>(null);

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
    if (!currentPalette || currentPalette.colors.length === 0) {
      generateNewPalette();
    }

    // Add keyboard listeners
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, generateNewPalette, currentPalette]);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  // this may be the cause of the bug where if you drag from right to left
  // the drag overlay teleports from the left to the right container.
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id && currentPalette) {
      const activeIndex = currentPalette.colors.findIndex(
        (color) => color.id === active.id
      );
      const overIndex = currentPalette.colors.findIndex(
        (color) => color.id === over.id
      );
      reorderColors(activeIndex, overIndex);
    }

    setActiveId(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
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
              disabled={!currentPalette || currentPalette.colors.length >= 16}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Color
            </Button>
          </div>
        </div>

        {/* Palette Display */}
        <div className="mx-auto mb-8 max-w-7xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentPalette?.colors || []}
                strategy={rectSortingStrategy}
              >
                {currentPalette?.colors.map((color, index) => (
                  <ColorCard key={color.id} color={color} index={index} />
                )) || []}
              </SortableContext>

              <DragOverlay>
                {activeId && currentPalette ? (
                  <div className="rotate-3 scale-105 transform opacity-95">
                    <ColorCard
                      color={
                        currentPalette.colors.find((c) => c.id === activeId)!
                      }
                      index={currentPalette.colors.findIndex(
                        (c) => c.id === activeId
                      )}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Controls */}
        <PaletteControls />

        {/* Export Modal */}
        <ExportModal />
      </div>
    </div>
  );
}
