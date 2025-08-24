import { useState, useEffect } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Save,
  Share,
  Check,
  Link,
  ChevronDown,
  Shuffle,
  Plus,
  Eye,
  Menu,
  Pencil,
  Palette,
  Camera,
  Grid3X3,
  Sliders,
  Undo,
  Redo,
  Keyboard,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "../image-uploader";
import { DebouncedSlider } from "../ui/debounced-slider";
import { ShareUtils } from "@/lib/share-utils";
import { ExportModal } from "../dialogs/export-modal";
import { MAX_PALETTE_COLORS } from "@/constants/ui";
import { PaletteMetadataSidebar } from "./metadata-sidebar";

export function PaletteNavbar() {
  const {
    currentPalette,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
    savePalette,
    isSaved,
    hasUnsavedChanges,
    isGenerating,
  } = usePaletteStore();

  const [paletteSize, setPaletteSize] = useState(
    currentPalette?.colors.length || 5
  );
  const [paletteName, setPaletteName] = useState("");
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isSizeControlOpen, setIsSizeControlOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    setPaletteSize(currentPalette?.colors.length || 5);
  }, [currentPalette]);

  const handleSizeChange = (value: number[]) => {
    generateNewPalette(value[0]);
    setPaletteSize(value[0]);
    setIsSizeControlOpen(false);
  };

  type MetadataValues = {
    name: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
    isFavorite?: boolean;
  };

  const handleMetadataSubmit = async (values: MetadataValues) => {
    const trimmedName = values.name?.trim();
    if (!trimmedName) {
      toast.error("Please enter a palette name");
      return;
    }

    try {
      await savePalette({
        ...currentPalette,
        name: trimmedName,
        description: values.description ?? "",
        tags: values.tags ?? [],
        isPublic: values.isPublic ?? false,
        isFavorite: values.isFavorite ?? false,
        updatedAt: new Date(),
      });

      toast.success(
        currentPalette?.id
          ? "Palette updated successfully!"
          : "Palette saved successfully!"
      );
      setIsMetadataOpen(false);
      setPaletteName("");
    } catch (error) {
      toast.error("Failed to save palette");
    }
  };

  const handleSave = async () => {
    if (!paletteName.trim()) {
      toast.error("Please enter a palette name");
      return;
    }

    try {
      await savePalette(paletteName.trim());
      toast.success(
        currentPalette?.id
          ? "Palette updated successfully!"
          : "Palette saved successfully!"
      );
      setIsSaveOpen(false);
      setIsMetadataOpen(false);
      setPaletteName("");
    } catch (error) {
      toast.error("Failed to save palette");
    }
  };

  const handleCopyUrl = async () => {
    if (!currentPalette) return;
    const result = await ShareUtils.copyUrlToClipboard(
      ShareUtils.generateEditorUrl(currentPalette),
      "Palette URL copied to clipboard!"
    );
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleShare = async () => {
    if (!currentPalette) return;
    const result = await ShareUtils.sharePalette(currentPalette);
    if (result.success) {
      toast.success(result.message);
    } else if (result.method !== "error") {
      toast.success(result.message);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex h-14 items-center justify-between sm:h-16">
            {/* Left Section - Palette Name */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMetadataOpen(true)}
                variant="ghost"
                className="flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Palette className="h-4 w-4 text-gray-500" />
                <div className="hidden flex-col sm:flex">
                  <span className="text-sm font-medium">
                    {currentPalette?.name || "Untitled Palette"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentPalette?.colors.length || 0} colors
                  </span>
                </div>
                <div className="sm:hidden">
                  <span className="text-sm font-medium">
                    {currentPalette?.name || "Untitled"}
                  </span>
                </div>
                <Pencil className="h-3 w-3 text-gray-400" />
              </Button>
            </div>

            {/* Center Section - Main Controls */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Generate New */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => generateNewPalette()}
                    disabled={isGenerating}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate new palette (Space)</p>
                </TooltipContent>
              </Tooltip>

              {/* Regenerate Unlocked */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={regenerateUnlocked}
                    disabled={isGenerating}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate unlocked colors</p>
                </TooltipContent>
              </Tooltip>

              {/* Palette Size Control */}
              <DropdownMenu
                open={isSizeControlOpen}
                onOpenChange={setIsSizeControlOpen}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust palette size</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="center" className="w-64 p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Palette Size: {paletteSize}
                    </Label>
                    <DebouncedSlider
                      value={[paletteSize]}
                      onChange={handleSizeChange}
                      debounce={300}
                      max={MAX_PALETTE_COLORS}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={addColor}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    disabled={
                      !currentPalette ||
                      currentPalette.colors.length >= MAX_PALETTE_COLORS
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new color</p>
                </TooltipContent>
              </Tooltip>

              {/* Extract from Image */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsUploadOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Extract colors from image</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1">
              {/* View/Preview */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 px-3">
                        <Eye className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Preview palette</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Full Screen Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Palette className="mr-2 h-4 w-4" />
                    Color Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export */}
              <ExportModal />

              {/* Share */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 px-3">
                        <Share className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share palette</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="mr-2 h-4 w-4" />
                    Share via Apps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Link className="mr-2 h-4 w-4" />
                    Copy URL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Save */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsSaveOpen(true)}
                    variant={hasUnsavedChanges ? "default" : "ghost"}
                    size="sm"
                    className="h-10 px-3"
                  >
                    {isSaved && !hasUnsavedChanges ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {currentPalette?.id ? "Save" : "Save"}
                    </span>
                    {hasUnsavedChanges && (
                      <span className="ml-1 text-xs">•</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{currentPalette?.id ? "Save changes" : "Save palette"}</p>
                </TooltipContent>
              </Tooltip>

              {/* More Menu */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                      >
                        <Menu className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More options</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsShortcutsOpen(true)}>
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Sliders className="mr-2 h-4 w-4" />
                    Adjust Colors
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Redo className="mr-2 h-4 w-4" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentPalette?.id ? "Update Palette" : "Save Palette"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="save-palette-name">Palette Name</Label>
              <Input
                id="save-palette-name"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Enter palette name..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {currentPalette?.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Image Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Extract Colors from Image</DialogTitle>
          </DialogHeader>
          <ImageUploader onClose={() => setIsUploadOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Generate new palette</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Copy color hex</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                  Click
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lock/unlock color</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                  L
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Save palette</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                  Ctrl+S
                </kbd>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsShortcutsOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Metadata Sidebar (Sheet) */}
      <PaletteMetadataSidebar
        open={isMetadataOpen}
        onOpenChange={setIsMetadataOpen}
        paletteName={paletteName}
        onPaletteNameChange={setPaletteName}
        onSave={handleSave}
        currentPaletteName={currentPalette?.name}
        onSubmit={handleMetadataSubmit}
        initialValues={{
          name: currentPalette?.name ?? "",
          description: currentPalette?.description ?? "",
          tags: currentPalette?.tags ?? [],
          isPublic: currentPalette?.isPublic ?? false,
          isFavorite: currentPalette?.isFavorite ?? false,
        }}
      />
    </>
  );
}
