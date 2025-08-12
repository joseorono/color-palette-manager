import { useState } from "react";
import { Color, ColorRole } from "@/types/palette";
import { usePaletteStore } from "@/stores/palette-store";
import { ColorPicker } from "./color-picker";
import { RoleAssigner } from "./role-assigner";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Lock, Unlock, Trash2, Copy } from "lucide-react";
import { ColorUtils } from "@/lib/color-utils";
import { cn, getAssignedRoles } from "@/lib/utils";

interface ColorCardProps {
  color: Color;
  index: number;
}

export function ColorCard({ 
  color, 
  index, 
}: ColorCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleColorLock, updateColor, removeColor, currentPalette } = usePaletteStore();

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
          "group relative transform transition-all duration-300 hover:scale-105",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Color Area */}
        <div
          className={`relative h-32 overflow-hidden rounded-lg shadow-lg md:h-48 lg:h-64`}
          style={{ backgroundColor: color.hex }}
          onClick={() => setIsPickerOpen(true)}
        >
          {/* Color Info Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-between bg-black bg-opacity-20 p-4 opacity-0 transition-opacity duration-200",
              isHovered && "opacity-100"
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
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {color.locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard();
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {currentPalette.length > 2 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(index);
                  }}
                  className="text-white hover:bg-red-500 hover:bg-opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* Color Info Bar */}
        <div className="mt-2 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
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
                onRoleAssign={(role: ColorRole | undefined) => updateColor(index, { role })}
                assignedRoles={getAssignedRoles(currentPalette)}
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
