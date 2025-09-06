import { useState, useEffect, useCallback } from "react";
import { usePaletteStore } from "@/stores/palette-store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { PaletteTabsPreview } from "../palette-tabs-preview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "../image-uploader";
import { DebouncedSlider } from "../ui/debounced-slider";
import { ShareUtils } from "@/lib/share-utils";
import { ExportModal } from "../dialogs/export-modal";
import { MAX_PALETTE_COLORS } from "@/constants/ui";
import { PaletteMetadataSidebar } from "./palette-metadata-sidebar";
import { Label } from "../ui/label";
import SplitButton from "../shadcn-blocks/split-button";
import { GenerationMethodDialog } from "./generation-method-dialog";
import { HARMONY_PRESETS } from "@/constants/color-harmonies";
import { HarmonyPreset } from "@/types/color-harmonies";

export function PaletteNavbar() {
  const {
    currentPalette,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
    addHarmoniousColor,
    removeColor,
    savePalette,
    hasUnsavedChanges,
    isGenerating,
    selectedPreset,
    setSelectedPreset,
  } = usePaletteStore();

  const [paletteSize, setPaletteSize] = useState(
    currentPalette?.colors.length || 5
  );
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSizeControlOpen, setIsSizeControlOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerationMethodOpen, setIsGenerationMethodOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPaletteSize(currentPalette?.colors.length || 5);
  }, [currentPalette]);

  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    const currentSize = currentPalette?.colors.length || 0;
    
    if (newSize > currentSize) {
      // Add harmonious colors to reach the new size
      const colorsToAdd = newSize - currentSize;
      for (let i = 0; i < colorsToAdd; i++) {
        addHarmoniousColor();
      }
    } else if (newSize < currentSize) {
      // Remove colors from the end to reach the new size
      const colorsToRemove = currentSize - newSize;
      for (let i = 0; i < colorsToRemove; i++) {
        removeColor(currentSize - 1 - i);
      }
    }
    
    setPaletteSize(newSize);
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
      setIsSaving(true);

      // Reset saving state after 2 seconds
      setTimeout(() => {
        setIsSaving(false);
      }, 2000);

      setIsSaveOpen(false);
      setIsMetadataOpen(false);
    } catch (error) {
      setIsSaving(false);
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

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const dialogOrSheetOpen = !!document.querySelector(
        '[role="dialog"][data-state="open"]'
      );

      // Space - Regenerate unlocked colors
      if (e.code === "Space" && !e.repeat && !dialogOrSheetOpen) {
        e.preventDefault();
        regenerateUnlocked();
      }
      // Shift + A - Add new color
      else if (e.key === "A" && e.shiftKey && !dialogOrSheetOpen) {
        e.preventDefault();
        if (currentPalette) {
          addColor();
        }
      }
      // Shift + S - Save palette
      else if (e.key === "S" && e.shiftKey && !dialogOrSheetOpen) {
        e.preventDefault();
        setIsSaveOpen(true);
      }
    },
    [regenerateUnlocked, currentPalette, addColor]
  );

  function palettePreviewNewTab() {
    // Open new tab with palette ID
    if (currentPalette?.id) {
      window.open(
        `/app/palette-preview?paletteId=${currentPalette.id}`,
        "_blank"
      );
    }
  }

  function handleOpenPreview() {
    setIsPreviewOpen(true);
  }

  function handleOpenGenerationMethod() {
    setIsGenerationMethodOpen(true);
  }

  function handleSelectGenerationMethod(preset: HarmonyPreset) {
    setSelectedPreset(preset);
    generateNewPalette(currentPalette?.colors.length);
    setIsGenerationMethodOpen(false);
  }

  useEffect(() => {
    // Add keyboard listeners
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <>
      <div id="palette-navbar" className="sticky z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
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
                  <SplitButton
                    mainButtonText=""
                    mainButtonIcon={Shuffle}
                    onMainButtonClick={() =>
                      generateNewPalette(currentPalette?.colors.length)
                    }
                    menuItems={[
                      {
                        id: "generate-new",
                        label: "Generate New Palette",
                        icon: Shuffle,
                        onClick: () =>
                          generateNewPalette(currentPalette?.colors.length),
                      },
                      {
                        id: "generation-method",
                        label: "Select Generation Method",
                        icon: Sliders,
                        onClick: handleOpenGenerationMethod,
                      },
                    ]}
                    variant="ghost"
                    size="sm"
                    dropdownButtonClassName="h-9 w-9"
                    mainButtonClassName="h-9 w-9"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate new palette</p>
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
                  <p>Add new color (Shift + A)</p>
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

              {/* Preview Split Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <SplitButton
                    mainButtonText="Preview"
                    mainButtonIcon={Eye}
                    onMainButtonClick={handleOpenPreview}
                    menuItems={[
                      {
                        id: "preview-palette",
                        label: "Preview Palette",
                        icon: Eye,
                        onClick: handleOpenPreview,
                      },
                      {
                        id: "fullscreen-preview",
                        label: "Full-Screen Preview",
                        icon: ExternalLink,
                        onClick: palettePreviewNewTab,
                      },
                    ]}
                    variant="outline"
                    size="sm"
                    dropdownButtonClassName="h-9 w-8"
                    mainButtonClassName="h-9 w-9"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview palette options</p>
                </TooltipContent>
              </Tooltip>

              {/* Export */}
              <ExportModal />

              {/* Save */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsSaveOpen(true)}
                    variant="default"
                    size="sm"
                    className="h-9 px-2 2xl:h-10 2xl:px-3"
                  >
                    {isSaving ? (
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
              <DropdownMenu modal={false}>
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
                  <DropdownMenuItem
                    onClick={() => setIsShortcutsOpen(true)}
                    className="cursor-pointer"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
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
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Generate new palette</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-800">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Add new color</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-800">
                  Shift + A
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Copy color hex</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-800">
                  Click
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Save palette</span>
                <kbd className="rounded border bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-800">
                  Ctrl+S
                </kbd>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setIsShortcutsOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-5xl"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Preview Palette</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-4rem)]">
            <PaletteTabsPreview 
              palette={currentPalette}
              classNameForViews="h-full"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Generation Method Dialog */}
      <GenerationMethodDialog
        open={isGenerationMethodOpen}
        onOpenChange={setIsGenerationMethodOpen}
        onSelect={handleSelectGenerationMethod}
        currentPreset={selectedPreset}
      />

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
