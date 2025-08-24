import React, { useEffect, useCallback, useState } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorCard } from "./color-card";
import { PaletteNavbar } from "./palette-navbar";
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
import { ColorUtils } from "@/lib/color-utils";
import { DRAG_ACTIVATION_DISTANCE } from "@/constants/ui";

export function PaletteGenerator() {
  const {
    currentPalette,
    generateNewPalette,
    regenerateUnlocked,
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
      const activeIndex = ColorUtils.getColorIndex(
        currentPalette.colors,
        active.id
      );
      const overIndex = ColorUtils.getColorIndex(
        currentPalette.colors,
        over.id
      );
      reorderColors(activeIndex, overIndex);
    }

    setActiveId(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <PaletteNavbar />
      
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
                        ColorUtils.findColorById(
                          currentPalette.colors,
                          activeId
                        )?.color!
                      }
                      index={ColorUtils.getColorIndex(
                        currentPalette.colors,
                        activeId
                      )}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
