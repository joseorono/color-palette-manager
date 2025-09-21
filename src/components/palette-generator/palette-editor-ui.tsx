import React from "react";
import { PaletteNavbar } from "@/components/palette-generator/palette-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaletteControls } from "@/components/palette-generator/palette-navbar/palette-controls";
import { usePaletteStore } from "@/stores/palette-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PaletteTabsPreview } from "@/components/palette-tabs-preview";
import { PaletteMetadataSidebar } from "@/components/palette-generator/palette-metadata-sidebar";
import { toast } from "sonner";
import { ShareUtils } from "@/lib/share-utils";
import { ImageUploader } from "@/components/image-uploader";
import { GenerationMethodDialog } from "@/components/palette-generator/generation-method-dialog";
import { HarmonyPreset } from "@/types/color-harmonies";
import { PaletteActions } from "./palette-navbar/palette-actions";

interface PaletteEditorUIProps {
  children: React.ReactNode;
}

export function PaletteEditorUI({ children }: PaletteEditorUIProps) {
  const {
    currentPalette,
    savePalette,
    generateNewPalette,
    selectedPreset,
    setSelectedPreset,
    regenerateUnlocked,
    addColor,
  } = usePaletteStore();

  const [isSaveOpen, setIsSaveOpen] = React.useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = React.useState(false);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isGenerationMethodOpen, setIsGenerationMethodOpen] =
    React.useState(false);

  type MetadataValues = {
    name: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
    isFavorite?: boolean;
  };

  const handleSelectGenerationMethod = (preset: HarmonyPreset) => {
    setSelectedPreset(preset);
    generateNewPalette(currentPalette?.colors.length);
    setIsGenerationMethodOpen(false);
  };

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const dialogOrSheetOpen = !!document.querySelector(
        '[role="dialog"][data-state="open"]'
      );
      if (dialogOrSheetOpen) return;

      // Space - Regenerate unlocked colors
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        regenerateUnlocked();
      }
      // Shift + A - Add new color
      else if (e.key === "A" && e.shiftKey) {
        e.preventDefault();
        addColor();
      }
      // Shift + S - Open save dialog
      else if (e.key === "S" && e.shiftKey && !e.repeat) {
        e.preventDefault();
        setIsSaveOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [regenerateUnlocked, addColor, setIsSaveOpen]);

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

  const handleOpenPreviewNewTab = () => {
    if (currentPalette?.id) {
      window.open(
        `/app/palette-preview?paletteId=${currentPalette.id}`,
        "_blank"
      );
    }
  };
  return (
    <div className="min-h-fullvh-with-navbar bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top bar (responsive inside) */}
      <PaletteNavbar
        onOpenSave={() => setIsSaveOpen(true)}
        onOpenMetadata={() => setIsMetadataOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenPreviewNewTab={handleOpenPreviewNewTab}
        onShare={handleShare}
        onCopyUrl={handleCopyUrl}
        onOpenGenerationMethod={() => setIsGenerationMethodOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
      />
      {/* Main content with bottom padding for mobile bottom bar height */}
      <div className="pb-16 sm:pb-0">{children}</div>
      {/* Mobile Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/85 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/85 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-2 py-2">
          <PaletteActions
            onShare={handleShare}
            onCopyUrl={handleCopyUrl}
            onOpenPreview={() => setIsPreviewOpen(true)}
            onOpenPreviewNewTab={handleOpenPreviewNewTab}
            onOpenSave={() => setIsSaveOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />
        </div>
      </div>
      {/* Save Dialog */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent className="max-sm:max-w-[400px] rounded-md">
          <DialogHeader>
            <DialogTitle className="text-center ">Save Changes?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will save your current changes to{" "}
              <span className="font-medium">
                {currentPalette?.name || "Untitled Palette"}
              </span>
              . Do you want to proceed?
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => handleMetadataSubmit()}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Keyboard Shortcuts
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
      {/* Upload Image Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-lg  max-h-[90vh] overflow-y-auto rounded-md max-sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">Extract Colors from Image</DialogTitle>
          </DialogHeader>
          <ImageUploader onClose={() => setIsUploadOpen(false)} />
        </DialogContent>
      </Dialog>
      {/* Generation Method Dialog */}
      <GenerationMethodDialog
        open={isGenerationMethodOpen}
        onOpenChange={setIsGenerationMethodOpen}
        onSelect={handleSelectGenerationMethod}
        currentPreset={selectedPreset}
      />
    </div>
  );
}

function MobileActionBar({
  onOpenGenerationMethod,
  onOpenUpload,
}: {
  onOpenGenerationMethod: () => void;
  onOpenUpload: () => void;
}) {
  // For mobile, reuse PaletteControls and wire to shared dialogs in PaletteEditorUI
  return (
    <div className="w-full">
      <PaletteControls
        onOpenGenerationMethod={onOpenGenerationMethod}
        onOpenUpload={onOpenUpload}
      />
    </div>
  );
}
