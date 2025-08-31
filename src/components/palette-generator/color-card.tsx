import { useState } from "react";
import { Color, ColorRole } from "@/types/palette";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorPicker } from "../color-picker";
import { RoleAssigner } from "../role-assigner";
import { Button } from "../ui/button";
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

  const colorName = ColorUtils.getColorName(color.hex);
  const actionBtnClass = cn(
    "text-white transition-all duration-200 ease-out hover:scale-110 active:scale-95",
    "hover:bg-white/20 active:bg-opacity-30"
  );
  const iconClass = "h-4 w-4 transition-transform duration-200";

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col rounded-lg bg-white shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-black/20 dark:bg-gray-800",
          "cursor-grab",
          isDragging &&
            "z-10 border-4 border-dashed border-blue-500 bg-blue-500/20 opacity-90"
        )}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <div
          className={cn(
            "flex flex-col items-end justify-start rounded-lg shadow-sm transition-all duration-300 ease-out"
          )}
        >
          {/* color square */}
          <div
            className={cn(
              "relative w-full rounded-t-lg transition-all duration-300 ease-out md:h-60",
              isDragging && "contrast-105 brightness-110"
            )}
            style={{ backgroundColor: color.hex }}
            onClick={() => setIsPickerOpen(true)}
          >
            {/* buttons */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-between rounded-t-lg p-4 opacity-0 transition-all duration-300 ease-out",
                isDragging ? "bg-black/30" : "bg-black/20",
                (isHovered || isDragging) && "opacity-100",
                isDragging && "backdrop-blur-md"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-start gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleColorLock(index);
                    }}
                    className={actionBtnClass}
                  >
                    {color.locked ? (
                      <Lock className={iconClass} />
                    ) : (
                      <Unlock className={iconClass} />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard();
                    }}
                    className={actionBtnClass}
                  >
                    <Copy className={iconClass} />
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
                      "text-white transition-all duration-200 ease-out hover:scale-110 active:scale-95",
                      "hover:bg-red-500/50 active:bg-red-600/60"
                    )}
                  >
                    <Trash2 className={cn(iconClass, "hover:rotate-12")} />
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* card color footer */}
          <div className="flex h-20 w-full items-start px-4 pt-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDragging
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-900 dark:text-white"
                  )}
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
                assignedRoles={PaletteUtils.getAssignedRoles(
                  currentPalette?.colors || []
                )}
              />
            </div>
          </div>
        </div>

        {color.locked && (
          <div className="absolute left-2 top-2 rounded-full bg-black/50 p-1">
            <Lock className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      <ColorPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        color={color.hex}
        onColorChange={(newColor) => updateColor(index, { hex: newColor })}
      />
    </>
  );
}
