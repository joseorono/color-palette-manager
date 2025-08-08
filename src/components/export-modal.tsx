import { useState } from "react";
import { usePaletteStore } from "@/stores/palette-store";
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
import { exportPalette } from "@/lib/palette-export";
import { ExportFormat } from "@/constants/export";
import type { ExportFormatType } from "@/types/export";
import { PalettePreview } from "./palette-preview";

export function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormatType>("png");
  const [isExporting, setIsExporting] = useState(false);

  const { currentPalette } = usePaletteStore();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Map local format types to library ExportFormat enum
      const formatMap: Record<ExportFormatType, ExportFormat> = {
        png: ExportFormat.PNG,
        svg: ExportFormat.SVG,
        css: ExportFormat.CSS,
        json: ExportFormat.JSON,
      };

      const result = await exportPalette(currentPalette, formatMap[format]);

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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Palette</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="mb-3 block text-sm font-medium">
              Export Format
            </Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
            >
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
            <Label className="mb-2 block text-sm font-medium">Preview</Label>
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
      </DialogContent>
    </Dialog>
  );
}
