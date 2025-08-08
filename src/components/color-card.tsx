import { useState } from 'react';
import { Color } from '@/types/palette';
import { usePaletteStore } from '@/stores/palette-store';
import { ColorPicker } from './color-picker';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Lock, Unlock, Trash2, Copy, Eye } from 'lucide-react';
import { getColorName, getContrastRatio } from '@/lib/color-utils';
import { cn } from '@/lib/utils';

interface ColorCardProps {
  color: Color;
}

export function ColorCard({ color }: ColorCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleColorLock, updateColor, removeColor, currentPalette } = usePaletteStore();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      toast.success('Color copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy color');
    }
  };

  const textColor = getContrastRatio(color.hex, '#ffffff') > 3 ? '#ffffff' : '#000000';
  const colorName = getColorName(color.hex);

  return (
    <>
      <div
        className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Color Area */}
        <div
          className="h-32 md:h-48 lg:h-64 rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: color.hex }}
          onClick={() => setIsPickerOpen(true)}
        >
          {/* Color Info Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-200 flex flex-col justify-between p-4",
              isHovered && "opacity-100"
            )}
          >
            {/* Top Controls */}
            <div className="flex justify-between items-start">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleColorLock(color.id);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {color.locked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </Button>
              
              {currentPalette.length > 2 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(color.id);
                  }}
                  className="text-white hover:bg-red-500 hover:bg-opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Bottom Info */}
            <div className="text-center">
              <p className="text-white text-sm font-medium mb-1">{colorName}</p>
              <p className="text-white text-xs opacity-80">{color.hex}</p>
            </div>
          </div>
        </div>

        {/* Color Info Bar */}
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {color.hex}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {colorName}
              </p>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPickerOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lock Indicator */}
        {color.locked && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Color Picker Modal */}
      <ColorPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        color={color.hex}
        onColorChange={(newColor) => updateColor(color.id, newColor)}
      />
    </>
  );
}