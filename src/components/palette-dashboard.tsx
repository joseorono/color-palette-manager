"use client"

import { useState, useMemo } from "react"
import { Plus, Grid3X3, List, LayoutGrid } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { PaletteCard } from "./palette-card"
import { PaletteFilters } from "./palette-filters"
import { LoadingCard } from "@/components/ui/loading-card"
import type { Palette, PaletteFilters as PaletteFiltersType } from "@/types/palette"

interface PaletteDashboardProps {
  palettes: Palette[]
  isLoading?: boolean
  onCreateNew?: () => void
  onEditPalette?: (palette: Palette) => void
  onDeletePalette?: (paletteId: string) => void
  onToggleFavorite?: (paletteId: string) => void
  onViewPalette?: (palette: Palette) => void
}

type ViewMode = 'grid' | 'compact' | 'list'

export function PaletteDashboard({
  palettes,
  isLoading = false,
  onCreateNew,
  onEditPalette,
  onDeletePalette,
  onToggleFavorite,
  onViewPalette,
}: PaletteDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<PaletteFiltersType>({
    search: "",
    tags: [],
    sortBy: "updatedAt",
    sortOrder: "desc",
    showFavoritesOnly: false,
  })

  // Get all available tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    palettes.forEach(palette => {
      palette.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [palettes])

  // Filter and sort palettes
  const filteredPalettes = useMemo(() => {
    let filtered = palettes

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(palette =>
        palette.name.toLowerCase().includes(searchLower) ||
        palette.description?.toLowerCase().includes(searchLower) ||
        palette.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(palette =>
        filters.tags.every((tag: string) => palette.tags?.includes(tag))
      )
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(palette => palette.isFavorite)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'favoriteCount':
          comparison = (a.favoriteCount || 0) - (b.favoriteCount || 0)
          break
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [palettes, filters])

  const getGridClasses = () => {
    switch (viewMode) {
      case 'compact':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      case 'list':
        return 'grid-cols-1'
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Palettes</h1>
          <p className="text-muted-foreground">
            {filteredPalettes.length} of {palettes.length} palettes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('compact')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Palette
          </Button>
        </div>
      </div>

      {/* Filters */}
      <PaletteFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
      />

      {/* Palettes Grid */}
      {filteredPalettes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No palettes found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search || filters.tags.length > 0 || filters.showFavoritesOnly
              ? "Try adjusting your filters to see more results."
              : "Create your first color palette to get started."}
          </p>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Palette
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${getGridClasses()}`}>
          {filteredPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              onEdit={onEditPalette}
              onDelete={onDeletePalette}
              onToggleFavorite={onToggleFavorite}
              onView={onViewPalette}
            />
          ))}
        </div>
      )}
    </div>
  )
}
