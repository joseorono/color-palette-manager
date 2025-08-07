'use client';

import { useState } from 'react';
import { usePaletteStore } from '@/stores/palette-store';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

type ExportFormat = 'png' | 'svg' | 'css' | 'json';

export function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  
  const { currentPalette } = usePaletteStore();

  const exportPNG = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 200;
    const colorWidth = width / currentPalette.length;

    canvas.width = width;
    canvas.height = height;

    currentPalette.forEach((color, index) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(index * colorWidth, 0, colorWidth, height);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, 'color-palette.png');
      }
    });
  };

  const exportSVG = () => {
    const width = 800;
    const height = 200;
    const colorWidth = width / currentPalette.length;

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    currentPalette.forEach((color, index) => {
      svgContent += `<rect x="${index * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}"/>`;
    });
    
    svgContent += '</svg>';

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    saveAs(blob, 'color-palette.svg');
  };

  const exportCSS = () => {
    let cssContent = '/* Color Palette CSS Variables */\n:root {\n';
    
    currentPalette.forEach((color, index) => {
      cssContent += `  --color-${index + 1}: ${color.hex};\n`;
    });
    
    cssContent += '}\n\n/* Color Classes */\n';
    
    currentPalette.forEach((color, index) => {
      cssContent += `.color-${index + 1} { color: ${color.hex}; }\n`;
      cssContent += `.bg-color-${index + 1} { background-color: ${color.hex}; }\n`;
    });

    const blob = new Blob([cssContent], { type: 'text/css' });
    saveAs(blob, 'color-palette.css');
  };

  const exportJSON = () => {
    const paletteData = {
      name: 'Color Palette',
      colors: currentPalette.map((color, index) => ({
        name: `Color ${index + 1}`,
        hex: color.hex,
        index: index + 1
      })),
      createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'color-palette.json');
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (format) {
        case 'png':
          await exportPNG();
          break;
        case 'svg':
          exportSVG();
          break;
        case 'css':
          exportCSS();
          break;
        case 'json':
          exportJSON();
          break;
      }
      
      toast.success('Palette exported successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to export palette');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Palette
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Palette</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png">PNG Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="svg" id="svg" />
                <Label htmlFor="svg">SVG Vector</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="css" id="css" />
                <Label htmlFor="css">CSS Variables</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON Data</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Preview */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Preview</Label>
            <div className="grid grid-cols-5 h-16 rounded-lg overflow-hidden border">
              {currentPalette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}