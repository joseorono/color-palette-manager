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
import { toast } from "@/hooks/use-toast";
import type { Palette } from "@/types/palette";
import { ShareUtils } from "@/lib/share-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";

interface PaletteCardProps {
  palette: Palette;
  onEdit?: (palette: Palette) => void;
  onDelete?: (paletteId: string) => void;
  onToggleFavorite?: (paletteId: string) => void;
  onView?: (palette: Palette) => void;
}

export function PaletteCard({
  palette,
  onEdit,
  onDelete,
  onToggleFavorite,
  onView,
}: PaletteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCopyColors = async () => {
    const result = await ShareUtils.copyPaletteColors(palette);
    toast({
      title: result.success ? "Colors copied!" : "Copy failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  const handleShare = async () => {
    const result = await ShareUtils.copyPaletteUrl(palette.id);
    toast({
      title: result.success ? "Link copied!" : "Share failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
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

    toast({
      title: "Palette exported!",
      description: "Your palette has been downloaded as a JSON file.",
    });
  };

  const handlePaletteNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const editorUrl = PaletteUrlUtils.generatePaletteIdUrl(palette.id);
    navigate(editorUrl);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(palette)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 
              className="truncate text-lg font-semibold cursor-pointer hover:underline transition-all duration-200 hover:text-primary"
              onClick={handlePaletteNameClick}
              title="Click to edit this palette"
            >
              {palette.name}
            </h3>
            {palette.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
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
        <div className="mb-3 flex h-20 overflow-hidden rounded-lg border">
          {palette?.colors?.map((color, index) => (
            <div
              key={index}
              className="group/color relative flex-1 transition-all duration-200"
              style={{ backgroundColor: color.hex }}
              title={`${color.name || "Untitled"} - ${color.hex}`}
            >
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/color:opacity-100">
                  <span className="rounded bg-black/50 px-1 py-0.5 text-xs font-medium text-white">
                    {color.hex}
                  </span>
                </div>
              )}
            </div>
          ))}
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
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{palette.colors?.length} colors</span>
          {palette.favoriteCount && palette.favoriteCount > 0 && (
            <span className="flex items-center">
              <Heart className="mr-1 h-3 w-3" />
              {palette.favoriteCount}
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
