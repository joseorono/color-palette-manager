import { useState } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { PaletteExport } from "@/lib/palette-export";
import { ExportFormat, exportFormatConfig } from "@/constants/export";

import { PalettePreview } from "./palette-preview";
import { ExportPreview } from "./export-preview";

export function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.PNG);
  const [isExporting, setIsExporting] = useState(false);
  const isMobile = useIsMobile();

  const { currentPalette } = usePaletteStore();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const result = await PaletteExport.export(currentPalette, format);

      // Create and download the file
      if (result.content instanceof Blob) {
        saveAs(result.content, result.filename);
      } else {
        const blob = new Blob([result.content], { type: result.mimeType });
        saveAs(blob, result.filename);
      }

      toast.success("Palette exported successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to export palette");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Palette
        </Button>
      </DialogTrigger>

      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-5xl'} overflow-hidden`}>
        <DialogHeader>
          <DialogTitle>Export Palette</DialogTitle>
        </DialogHeader>

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} ${isMobile ? 'overflow-auto max-h-[70vh]' : ''}`}>
          {/* Left Column - Controls */}
          <div id="export-controls-column" className="space-y-6">
            {/* Format Selection */}
            <div>
              <Label className="mb-3 block text-sm font-medium">
                Export Format
              </Label>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as ExportFormat)}
              >
                {Object.entries(exportFormatConfig).map(([formatValue, config]) => (
                  <div key={formatValue} className="flex items-center space-x-2">
                    <RadioGroupItem value={formatValue} id={formatValue} />
                    <Label htmlFor={formatValue}>{config.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Color Preview */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Color Preview</Label>
              <PalettePreview 
                colors={currentPalette}
                height="4rem"
                showTooltips={true}
                borderRadius="lg"
                showBorder={true}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>

          {/* Right Column - Export Preview (Hidden on Mobile) */}
          {!isMobile && (
            <div id="export-preview-column" className="space-y-3">
              <Label className="block text-sm font-medium">
                Export Preview
              </Label>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-96">
                <ExportPreview colors={currentPalette} format={format} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
