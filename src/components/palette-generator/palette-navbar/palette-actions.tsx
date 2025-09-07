import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SplitButton from "@/components/shadcn-blocks/split-button";
import { ExportModal } from "@/components/dialogs/export-modal";
import {
  Share,
  ChevronDown,
  Link,
  Eye,
  ExternalLink,
  Save,
  Menu,
  Keyboard,
} from "lucide-react";
import { usePaletteStore } from "@/stores/palette-store";

interface PaletteActionsProps {
  onShare: () => void;
  onCopyUrl: () => void;
  onOpenPreview: () => void;
  onOpenPreviewNewTab: () => void;
  onOpenSave: () => void;
  onOpenShortcuts: () => void;
}

export function PaletteActions({
  onShare,
  onCopyUrl,
  onOpenPreview,
  onOpenPreviewNewTab,
  onOpenSave,
  onOpenShortcuts,
}: PaletteActionsProps) {
  const { hasUnsavedChanges } = usePaletteStore();
  return (
    <div className="flex w-full items-center justify-between gap-2 lg:w-auto 2xl:justify-self-end">
      {/* Left actions (mobile: align start) */}
      <div className="flex items-center gap-1">
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
            <DropdownMenuItem onClick={onShare} className="cursor-pointer">
              <Share className="mr-2 h-4 w-4" />
              Share via Apps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopyUrl} className="cursor-pointer">
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
              onMainButtonClick={onOpenPreview}
              menuItems={[
                {
                  id: "preview-palette",
                  label: "Preview Palette",
                  icon: Eye,
                  onClick: onOpenPreview,
                },
                {
                  id: "fullscreen-preview",
                  label: "Full-Screen Preview",
                  icon: ExternalLink,
                  onClick: onOpenPreviewNewTab,
                },
              ]}
              variant="ghost"
              size="lg"
              dropdownButtonClassName="h-9 w-9"
              mainButtonClassName="h-9 w-9"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Preview palette options</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Right actions (mobile: align end) */}
      <div className="flex items-center gap-1">
        {/* Export */}
        <ExportModal />
        {/* Save */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onOpenSave}
              variant="default"
              size="sm"
              className="h-9 px-2 2xl:h-10 2xl:px-3"
            >
              <Save className="mr-2 h-4 w-4" />
              <span className="inline">Save</span>
              {hasUnsavedChanges && <span className="ml-1 text-xs">•</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save palette</p>
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
              onClick={onOpenShortcuts}
              className="cursor-pointer"
            >
              <Keyboard className="mr-2 h-4 w-4" /> Keyboard Shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
