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

import { PalettePreview } from "./palette-preview";

export function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.PNG);
  const [isExporting, setIsExporting] = useState(false);

  const { currentPalette } = usePaletteStore();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const result = await exportPalette(currentPalette, format);

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
                <RadioGroupItem value={ExportFormat.PNG} id="png" />
                <Label htmlFor="png">PNG Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.SVG} id="svg" />
                <Label htmlFor="svg">SVG Vector</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.CSS} id="css" />
                <Label htmlFor="css">CSS Variables</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.JSON} id="json" />
                <Label htmlFor="json">JSON Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.SCSS} id="scss" />
                <Label htmlFor="scss">SCSS Variables</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.TAILWIND} id="tailwind" />
                <Label htmlFor="tailwind">Tailwind Config</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.DAISYUI} id="daisyui" />
                <Label htmlFor="daisyui">DaisyUI Theme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ExportFormat.SHADCN} id="shadcn" />
                <Label htmlFor="shadcn">Shadcn/UI Variables</Label>
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
