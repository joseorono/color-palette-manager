"use client";

import { useMemo, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Grid3X3, List, LayoutGrid, Upload } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PaletteCard } from "./palette-generator/palette-card";
import { PaletteFilters } from "./palette-filters";
import { LoadingCard } from "@/components/loaders/loading-card";
import type {
  Palette,
  PaletteFilters as PaletteFiltersType,
  ViewMode,
  SortByOption,
  SortOrderOption,
} from "@/types/palette";
import { CreatePaletteTrigger } from "./create-palette-trigger";
import ImportPaletteModal from "./import-palette-modal";

interface PaletteDashboardProps {
  palettes: Palette[];
  isLoading?: boolean;
  onCreateNew?: () => void;
  onEditPalette?: (palette: Palette) => void;
  onDeletePalette?: (paletteId: string) => void;
  onToggleFavorite?: (paletteId: string) => void;
  onViewPalette?: (palette: Palette) => void;
}

export function PaletteDashboard({
  palettes,
  isLoading = false,
  onCreateNew,
  onEditPalette,
  onDeletePalette,
  onToggleFavorite,
  onViewPalette,
}: PaletteDashboardProps) {
  // URL state for view mode with debouncing
  const [viewMode, setViewMode] = useQueryState<ViewMode>("view", {
    defaultValue: "grid",
    parse: (value) => {
      return ["grid", "compact", "list"].includes(value)
        ? (value as ViewMode)
        : "grid";
    },
    serialize: (value) => value,
  });

  // Local state for view mode to enable debouncing
  const [localViewMode, setLocalViewMode] = useState<ViewMode>(viewMode);
  const debouncedViewMode = useDebounce(localViewMode, 200);

  // Update URL when debounced view mode changes
  useEffect(() => {
    if (debouncedViewMode !== viewMode) {
      setViewMode(debouncedViewMode);
    }
  }, [debouncedViewMode, setViewMode, viewMode]);

  const [importModalOpen, setImportModalOpen] = useState(false);

  // URL state for search term with debouncing
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });

  // Local state for search input to enable debouncing
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      setSearchTerm(debouncedSearch);
    }
  }, [debouncedSearch, setSearchTerm, searchTerm]);

  // URL state for tags (array of strings)
  const [tags, setTags] = useQueryState("tags", {
    defaultValue: [] as string[],
    parse: (value) => (value ? value.split(",") : []),
    serialize: (value) => value.join(","),
  });

  // URL state for sort by
  const [sortBy, setSortBy] = useQueryState<SortByOption>("sortBy", {
    defaultValue: "updatedAt" as SortByOption,
    parse: (value) => {
      return ["name", "createdAt", "updatedAt", "favoriteCount"].includes(value)
        ? (value as SortByOption)
        : "updatedAt";
    },
    serialize: (value) => value,
  });

  // URL state for sort order
  const [sortOrder, setSortOrder] = useQueryState<SortOrderOption>(
    "sortOrder",
    {
      defaultValue: "desc" as SortOrderOption,
      parse: (value) => (value === "asc" ? "asc" : "desc"),
      serialize: (value) => value,
    }
  );

  // URL state for favorites filter
  const [showFavoritesOnly, setShowFavoritesOnly] = useQueryState("favorites", {
    defaultValue: false,
    parse: (value) => value === "true",
    serialize: (value) => value.toString(),
  });

  // Combine all filter states into a single filters object for compatibility
  const filters: PaletteFiltersType = {
    search: localSearch, // Use local search for UI updates
    tags,
    sortBy,
    sortOrder,
    showFavoritesOnly,
  };

  // Function to update all filters at once
  const setFilters = async (newFilters: PaletteFiltersType) => {
    // Update local search state immediately for UI
    setLocalSearch(newFilters.search);

    await Promise.all([
      // Search term is updated via the debounce effect
      setTags(newFilters.tags),
      setSortBy(newFilters.sortBy),
      setSortOrder(newFilters.sortOrder),
      setShowFavoritesOnly(newFilters.showFavoritesOnly),
    ]);
  };

  // Get all available tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    palettes.forEach((palette) => {
      palette.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [palettes]);

  // Filter and sort palettes
  const filteredPalettes = useMemo(() => {
    let filtered = palettes;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (palette) =>
          palette.name.toLowerCase().includes(searchLower) ||
          palette.description?.toLowerCase().includes(searchLower) ||
          palette.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((palette) =>
        filters.tags.every((tag: string) => palette.tags?.includes(tag))
      );
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter((palette) => palette.isFavorite);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "favoriteCount":
          comparison = (a.favoriteCount || 0) - (b.favoriteCount || 0);
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [palettes, filters]);

  const getGridClasses = () => {
    switch (localViewMode) {
      case "compact":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl sm:mx-9">My Palettes</h1>
          <p className="text-sm text-muted-foreground sm:text-base sm:mx-9">
            {filteredPalettes.length} of {palettes.length} palettes
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          {/* View Mode Toggle */}
          <div className="flex w-full gap-1 rounded-lg border p-1 sm:w-auto">
            <Button
              variant={localViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => setLocalViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="ml-1 text-xs sm:hidden">Grid</span>
            </Button>
            <Button
              variant={localViewMode === "compact" ? "default" : "ghost"}
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => setLocalViewMode("compact")}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="ml-1 text-xs sm:hidden">Compact</span>
            </Button>
            <Button
              variant={localViewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => setLocalViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="ml-1 text-xs sm:hidden">List</span>
            </Button>
          </div>

          {/* <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Palette
          </Button> */}
          {/* Replace the old create button with the new trigger */}

          <div className="flex w-full gap-2 sm:w-auto sm:ml-2 sm:mr-7">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="flex-1 sm:flex-initial sm:size-lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Import Palette</span>
              <span className="sm:hidden">Import</span>
            </Button>

            <div className="flex-1 sm:flex-initial">
              <CreatePaletteTrigger size="sm">
                <span className="mr-2">🎨</span>
                <span className="hidden sm:inline">Create Palette</span>
                <span className="sm:hidden">Create</span>
              </CreatePaletteTrigger>
            </div>
          </div>

          <ImportPaletteModal
            open={importModalOpen}
            onOpenChange={setImportModalOpen}
          />
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
        <div className="py-8 text-center px-4">
          <div className="mx-auto mb-4 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <LayoutGrid className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-base sm:text-lg font-medium">No palettes found</h3>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            {filters.search ||
            filters.tags.length > 0 ||
            filters.showFavoritesOnly
              ? "Try adjusting your filters to see more results."
              : "Create your first color palette to get started."}
          </p>
          {onCreateNew && (
            <Button onClick={onCreateNew} size="sm" className="sm:size-default">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Palette
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-2 sm:gap-3 md:gap-4 ${getGridClasses()}`}>
          {filteredPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              onEdit={onEditPalette}
              onDelete={onDeletePalette}
              onToggleFavorite={onToggleFavorite}
              onView={onViewPalette}
              viewMode={localViewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
