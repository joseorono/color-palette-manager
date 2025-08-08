import { useState, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { generateShades, getColorName, getContrastRatio } from '@/lib/color-utils';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ isOpen, onClose, color, onColorChange }: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(color);
  const [shades, setShades] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTempColor(color);
      setShades(generateShades(color));
    }
  }, [isOpen, color]);

  useEffect(() => {
    setShades(generateShades(tempColor));
  }, [tempColor]);

  const handleSave = () => {
    onColorChange(tempColor);
    onClose();
  };

  const colorName = getColorName(tempColor);
  const contrastWhite = getContrastRatio(tempColor, '#ffffff');
  const contrastBlack = getContrastRatio(tempColor, '#000000');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Color Picker</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Color Preview */}
          <div
            className="h-20 rounded-lg border"
            style={{ backgroundColor: tempColor }}
          />
          
          {/* Color Picker */}
          <div className="space-y-4">
            <HexColorPicker color={tempColor} onChange={setTempColor} />
            
            <div>
              <Label htmlFor="hex-input">Hex Code</Label>
              <HexColorInput
                id="hex-input"
                color={tempColor}
                onChange={setTempColor}
                className="w-full px-3 py-2 border rounded-md font-mono"
                prefixed
              />
            </div>
          </div>

          {/* Color Information */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{colorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contrast (White):</span>
              <span className="font-medium">{contrastWhite.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contrast (Black):</span>
              <span className="font-medium">{contrastBlack.toFixed(2)}</span>
            </div>
          </div>

          {/* Shades */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Shades</Label>
            <div className="grid grid-cols-9 gap-1">
              {shades.map((shade, index) => (
                <button
                  key={index}
                  className="h-8 rounded border hover:scale-110 transition-transform"
                  style={{ backgroundColor: shade }}
                  onClick={() => setTempColor(shade)}
                  title={shade}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Apply Color
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}