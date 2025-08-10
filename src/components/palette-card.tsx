"use client"

import { useState } from "react"
import { MoreHorizontal, Heart, Eye, Copy, Edit, Trash2, Share2, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import type { Palette } from "@/types/palette"

interface PaletteCardProps {
  palette: Palette
  onEdit?: (palette: Palette) => void
  onDelete?: (paletteId: string) => void
  onToggleFavorite?: (paletteId: string) => void
  onView?: (palette: Palette) => void
}

export function PaletteCard({ palette, onEdit, onDelete, onToggleFavorite, onView }: PaletteCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopyColors = () => {
    const colorString = palette.colors.map(color => color.hex).join(', ')
    navigator.clipboard.writeText(colorString)
    toast({
      title: "Colors copied!",
      description: "Color codes have been copied to your clipboard.",
    })
  }

  const handleShare = () => {
    const url = `${window.location.origin}/palette/${palette.id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Palette link has been copied to your clipboard.",
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(palette, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${palette.name.replace(/\s+/g, '-').toLowerCase()}-palette.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Palette exported!",
      description: "Your palette has been downloaded as a JSON file.",
    })
  }

  return (
    <Card 
      className="group transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(palette)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{palette.name}</h3>
            {palette.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{palette.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${palette.isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite?.(palette.id)
              }}
            >
              <Heart className={`h-4 w-4 ${palette.isFavorite ? 'fill-current' : ''}`} />
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
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(palette) }}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(palette) }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Palette
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCopyColors() }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Colors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare() }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Palette
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExport() }}>
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(palette.id) }}
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
        <div className="flex rounded-lg overflow-hidden h-20 mb-3 border">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 relative group/color transition-all duration-200"
              style={{ backgroundColor: color.hex }}
              title={`${color.name || 'Untitled'} - ${color.hex}`}
            >
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/color:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium px-1 py-0.5 bg-black/50 rounded">
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

      <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{palette.colors.length} colors</span>
          {palette.favoriteCount && palette.favoriteCount > 0 && (
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {palette.favoriteCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {palette.isPublic && (
            <Badge variant="outline" className="text-xs">
              Public
            </Badge>
          )}
          <span>{new Date(palette.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
