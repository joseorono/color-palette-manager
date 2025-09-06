"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Heart,
  Eye,
  Copy,
  Edit,
  Trash2,
  Share2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Palette } from "@/types/palette";
import { ShareUtils } from "@/lib/share-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { cn } from "@/lib/utils";
import { PalettePreview } from "../palette-preview";

interface PaletteCardProps {
  palette: Palette;
  onEdit?: (palette: Palette) => void;
  onDelete?: (paletteId: string) => void;
  onToggleFavorite?: (paletteId: string) => void;
  onView?: (palette: Palette) => void;
  viewMode?: string;
}

export function PaletteCard({
  palette,
  onEdit,
  onDelete,
  onToggleFavorite,
  onView,
  viewMode,
}: PaletteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCopyColors = async () => {
    const result = await ShareUtils.copyPaletteColors(palette);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleShare = async () => {
    const result = await ShareUtils.copyPaletteUrl(palette.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(palette, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${palette.name.replace(/\s+/g, "-").toLowerCase()}-palette.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Your palette has been downloaded as a JSON file.");
  };

  const handlePaletteNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const editorUrl = PaletteUrlUtils.generatePaletteIdUrl(palette.id);
    navigate(editorUrl);
  };

  const handlePreviewPalette = (paletteId: string) => {
    const previewUrl = PaletteUrlUtils.generatePaletteIdPreviewUrl(paletteId);
    navigate(previewUrl);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3
              className="cursor-pointer truncate text-lg font-semibold transition-all duration-200 hover:text-primary hover:underline"
              onClick={handlePaletteNameClick}
              title="Click to edit this palette"
            >
              {palette.name}
            </h3>
            {palette.description && (
              <p
                className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground"
                onClick={() => onView?.(palette)}
              >
                {palette.description}
              </p>
            )}
          </div>
          <div className="ml-2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${palette.isFavorite ? "text-red-500" : "text-muted-foreground"}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(palette.id);
              }}
            >
              <Heart
                className={`h-4 w-4 ${palette.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(palette);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewPalette(palette.id);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(palette);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Palette
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyColors();
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Colors
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Palette
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport();
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(palette.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Color Preview */}
        <div className="mb-3">
          <PalettePreview
            colors={palette?.colors || []}
            height="5rem"
            borderRadius="lg"
            showBorder={true}
            showHoverEffects={isHovered}
            enableCopyOnClick={true}
            showTooltips={true}
            showColorNames={true}
          />
        </div>

        {/* Tags */}
        {palette.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {palette.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {palette.tags?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{palette.tags?.length - 3}
              </Badge>
            )}
          </div>
        )}

        {palette.tags?.length == 0 && (
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              No tags
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter
        className={
          viewMode === "compact"
            ? "flex min-h-10 flex-col items-center justify-between gap-3 pt-0 text-sm text-muted-foreground"
            : "flex items-center justify-between pt-0 text-sm text-muted-foreground"
        }
      >
        <div className="flex items-center space-x-4">
          <span>{palette.colors?.length} colors</span>
          {palette.favoriteCount && palette.favoriteCount > 0 ? (
            <span className="flex items-center">
              <Heart className="mr-1 h-3 w-3" />
              {palette.favoriteCount}
            </span>
          ) : (
            <span className="flex items-center">
              <Heart className="mr-1 h-3 w-3" />0
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={palette.isPublic ? "default" : "outline"}
            className="text-xs"
          >
            {palette.isPublic ? "Public" : "Private"}
          </Badge>
          <span>{new Date(palette.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
