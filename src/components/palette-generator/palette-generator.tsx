import React, { useEffect, useState } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorCard } from "./color-card";
import { PaletteUI } from "@/components/palette-generator/palette-ui";
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
import { Lock } from "lucide-react";

export function PaletteGenerator() {
  const { currentPalette, generateNewPalette, reorderColors } =
    usePaletteStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  useEffect(() => {
    // Generate initial palette
    if (!currentPalette || currentPalette.colors.length === 0) {
      generateNewPalette();
    }
  }, []);
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
    <PaletteUI>
      <div id="palette-editor-main" className="container mx-auto px-4 py-2">
        {/* Header */}
        <div className="mb-8 text-center max-w-screen-lg mx-auto">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Regenerate all non-locked colors by pressing{" "}
            <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              Space
            </kbd>{" "}
            or clicking the shuffle button. Make sure to{" "}
            <Lock className="inline-block h-3 w-3" /> all colors you like.
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
                  <div className="rotate-3 scale-105 transform rounded-lg opacity-95">
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
    </PaletteUI>
  );
}
