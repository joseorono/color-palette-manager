import { useState, useEffect } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { Button } from "../ui/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
  Sliders,
  Undo,
  Redo,
  Keyboard,
  Info,
  Grid3X3,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "../image-uploader";
import { DebouncedSlider } from "../ui/debounced-slider";
import { ShareUtils } from "@/lib/share-utils";
import { ExportModal } from "../dialogs/export-modal";
import { MAX_PALETTE_COLORS } from "@/constants/ui";
import { PaletteMetadataSidebar } from "./palette-metadata-sidebar";
import { Label } from "../ui/label";

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
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSizeControlOpen, setIsSizeControlOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    setPaletteSize(currentPalette?.colors.length || 5);
  }, [currentPalette]);

  const handleSizeChange = (value: number[]) => {
    generateNewPalette(value[0]);
    setPaletteSize(value[0]);
  };

  type MetadataValues = {
    name: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
    isFavorite?: boolean;
  };

  const handleMetadataSubmit = async (values?: MetadataValues) => {
    const trimmedName = values
      ? values.name?.trim()
      : currentPalette.name.trim();
    if (!trimmedName) {
      toast.error("Please enter a palette name");
      return;
    }

    try {
      await savePalette(
        values
          ? {
              ...currentPalette,
              name: trimmedName,
              description: values.description ?? "",
              tags: values.tags ?? [],
              isPublic: values.isPublic ?? false,
              isFavorite: values.isFavorite ?? false,
              updatedAt: new Date(),
            }
          : currentPalette.name.trim()
      );

      toast.success(
        currentPalette?.id
          ? "Palette updated successfully!"
          : "Palette saved successfully!"
      );
      setIsSaveOpen(false);
      setIsMetadataOpen(false);
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
      <div className="sticky z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto px-2 2xl:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 py-4 2xl:grid 2xl:h-16 2xl:grid-cols-3">
            {/* Left Section - Palette Name */}
            <div className="flex-shrink-0 2xl:justify-self-start">
              <Button
                onClick={() => setIsMetadataOpen(true)}
                variant="ghost"
                className="flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Palette className="h-6 w-6 text-gray-500" />
                <div className="hidden flex-col lg:flex">
                  <span className="text-2xl font-medium">
                    {currentPalette?.name || "Untitled Palette"}
                  </span>
                </div>
                <Pencil className="h-3 w-3 text-gray-400" />
              </Button>
            </div>

            {/* Center Section - Main Controls */}
            <div className="flex snap-x snap-mandatory items-center px-1 2xl:gap-1 2xl:justify-self-center">
              {/* Generate New */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() =>
                      generateNewPalette(currentPalette?.colors.length)
                    }
                    disabled={isGenerating}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
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
                    className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate unlocked colors</p>
                </TooltipContent>
              </Tooltip>

              {/* Palette Size Control */}
              <div className="hidden px-1 shadow-sm lg:block 2xl:px-2">
                <DebouncedSlider
                  value={[paletteSize]}
                  onChange={handleSizeChange}
                  debounce={500}
                  max={MAX_PALETTE_COLORS}
                  min={2}
                  step={1}
                  className="w-40 cursor-grab 2xl:w-32"
                />
              </div>

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
                        className="block h-9 w-9 lg:hidden"
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
                    className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
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
                    className="h-9 w-9 shrink-0 snap-start p-0 2xl:h-10 2xl:w-10"
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
            <div className="flex items-center gap-1 2xl:justify-self-end">
              {/* View/Preview */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-2 2xl:h-10 2xl:px-3"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span className="hidden 2xl:inline">Preview</span>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-2 2xl:h-10 2xl:px-3"
                      >
                        <Share className="mr-2 h-4 w-4" />
                        <span className="hidden 2xl:inline">Share</span>
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
                    className="h-9 px-2 2xl:h-10 2xl:px-3"
                  >
                    {isSaved && !hasUnsavedChanges ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    <span className="hidden 2xl:inline">Save</span>
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
                        className="h-9 w-9 p-0 2xl:h-10 2xl:w-10"
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
            <DialogTitle>Save Changes?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will save your current changes to{" "}
              <span className="font-medium">
                {currentPalette?.name || "Untitled Palette"}
              </span>
              . Do you want to proceed?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleMetadataSubmit()}>
                Save Changes
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
