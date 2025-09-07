import { PaletteTitle } from "@/components/palette-generator/palette-navbar/palette-title";
import { PaletteControls } from "@/components/palette-generator/palette-navbar/palette-controls";
import { PaletteActions } from "@/components/palette-generator/palette-navbar/palette-actions";
import { useIsMobile } from "@/hooks/use-mobile";

type PaletteNavbarProps = {
  onOpenSave: () => void;
  onOpenMetadata: () => void;
  onOpenShortcuts: () => void;
  onOpenPreview: () => void;
  onOpenPreviewNewTab: () => void;
  onShare: () => void;
  onCopyUrl: () => void;
  onOpenGenerationMethod: () => void;
  onOpenUpload: () => void;
};

export function PaletteNavbar({
  onOpenSave,
  onOpenMetadata,
  onOpenShortcuts,
  onOpenPreview,
  onOpenPreviewNewTab,
  onShare,
  onCopyUrl,
  onOpenGenerationMethod,
  onOpenUpload,
}: PaletteNavbarProps) {
  return (
    <>
      <div
        id="palette-navbar"
        className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
      >
        <div className="container mx-auto px-2 2xl:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 py-4 xl:grid xl:grid-cols-3">
            {/* Title Section */}
            <PaletteTitle onOpenMetadata={onOpenMetadata} />

            {/* Controls Section */}

            <PaletteControls
              onOpenGenerationMethod={onOpenGenerationMethod}
              onOpenUpload={onOpenUpload}
            />

            {/* Actions Section */}
            <div className="hidden lg:contents">
              <PaletteActions
                onShare={onShare}
                onCopyUrl={onCopyUrl}
                onOpenPreview={onOpenPreview}
                onOpenPreviewNewTab={onOpenPreviewNewTab}
                onOpenSave={onOpenSave}
                onOpenShortcuts={onOpenShortcuts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
