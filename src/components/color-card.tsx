import { useState } from "react";
import { Color, ColorRole } from "@/types/palette";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorPicker } from "./color-picker";
import { RoleAssigner } from "./role-assigner";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Lock, Unlock, Trash2, Copy } from "lucide-react";
import { ColorUtils } from "@/lib/color-utils";
import { cn } from "@/lib/utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ColorCardProps {
  color: Color;
  index: number;
}

export function ColorCard({ color, index }: ColorCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleColorLock, updateColor, removeColor, currentPalette } =
    usePaletteStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: color.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      toast.success("Color copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy color");
    }
  };

  // const textColor =
  //   getContrastRatio(color.hex, "#ffffff") > 3 ? "#ffffff" : "#000000";
  const colorName = ColorUtils.getColorName(color.hex);

  return (
    <>
      <div
        className={cn(
          "group relative transform transition-all duration-300 ease-out",
          // Base hover effects
          "hover:scale-105 hover:shadow-xl hover:shadow-black/20",
          // Non-dragging state
          !isDragging && [
            "hover:shadow-lg hover:shadow-black/10",
            "cursor-grab active:cursor-grabbing",
          ],
          // Dragging state
          isDragging && [
            "z-50 cursor-grabbing opacity-90",
            "z-10 rounded-lg border-4 border-dashed border-blue-500 bg-blue-500 bg-opacity-20",
          ],
          // Smooth transitions for all states
          "transition-[transform,box-shadow,opacity,filter] duration-300"
        )}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        {/* Main Color Area */}
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-lg shadow-lg md:h-48 lg:h-64",
            "transition-all duration-300 ease-out",
            // Hover effects for the color area
            "hover:rounded-xl hover:shadow-xl",
            // Dragging state effects
            "cursor-pointer hover:cursor-pointer",
            // Interactive cursor
            isDragging &&
              "contrast-105 cursor-grabbing brightness-110 hover:cursor-grabbing"
          )}
          style={{ backgroundColor: color.hex }}
          onClick={() => setIsPickerOpen(true)}
        >
          {/* Color Info Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-between bg-black bg-opacity-20 p-4",
              "opacity-0 transition-all duration-300 ease-out",
              "backdrop-blur-sm",
              // Show overlay on hover or when dragging
              (isHovered || isDragging) && "opacity-100",
              // Enhanced overlay when dragging
              isDragging && "bg-opacity-30 backdrop-blur-md"
            )}
          >
            {/* Top Controls */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColorLock(index);
                  }}
                  className={cn(
                    "text-white transition-all duration-200 ease-out",
                    "hover:scale-110 hover:bg-white hover:bg-opacity-20",
                    "active:scale-95 active:bg-opacity-30",
                    "backdrop-blur-sm"
                  )}
                >
                  {color.locked ? (
                    <Lock className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <Unlock className="h-4 w-4 transition-transform duration-200" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard();
                  }}
                  className={cn(
                    "text-white transition-all duration-200 ease-out",
                    "hover:scale-110 hover:bg-white hover:bg-opacity-20",
                    "active:scale-95 active:bg-opacity-30",
                    "backdrop-blur-sm"
                  )}
                >
                  <Copy className="h-4 w-4 transition-transform duration-200" />
                </Button>
              </div>

              {currentPalette && currentPalette.colors.length > 2 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(index);
                  }}
                  className={cn(
                    "text-white transition-all duration-200 ease-out",
                    "hover:scale-110 hover:bg-red-500 hover:bg-opacity-50",
                    "active:scale-95 active:bg-red-600 active:bg-opacity-60",
                    "backdrop-blur-sm"
                  )}
                >
                  <Trash2 className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Color Info Bar */}
        <div
          className={cn(
            "mt-2 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800",
            "transition-all duration-300 ease-out",
            "dark:hover:bg-gray-750 hover:bg-gray-50 hover:shadow-md",
            // Enhanced styling when dragging
            isDragging && "dark:bg-gray-750 bg-gray-50 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-medium ${isDragging ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}
                >
                  {color.hex}
                </p>
                {color.role && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {color.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {colorName}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <RoleAssigner
                currentRole={color.role}
                onRoleAssign={(role: ColorRole | undefined) =>
                  updateColor(index, { role })
                }
                assignedRoles={PaletteUtils.getAssignedRoles(currentPalette?.colors || [])}
              />
            </div>
          </div>
        </div>

        {/* Lock Indicator */}
        {color.locked && (
          <div className="absolute left-2 top-2 rounded-full bg-black bg-opacity-50 p-1">
            <Lock className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Color Picker Modal */}
      <ColorPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        color={color.hex}
        onColorChange={(newColor) => updateColor(index, { hex: newColor })}
      />
    </>
  );
}
