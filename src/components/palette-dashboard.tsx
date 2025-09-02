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
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col max-sm:text-center max-sm:items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold ">My Palettes</h1>
          <p className="text-muted-foreground">
            {filteredPalettes.length} of {palettes.length} palettes
          </p>
        </div>

        <div className="flex max-sm:flex-col max-sm:w-[50%] max-sm:items-center max-sm:justify-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex max-sm:w-full gap-1 rounded-lg border p-1">
            <Button
              variant={localViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="max-sm:flex-1"
              onClick={() => setLocalViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={localViewMode === "compact" ? "default" : "ghost"}
              size="sm"
              className="max-sm:flex-1"
              onClick={() => setLocalViewMode("compact")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={localViewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="max-sm:flex-1"
              onClick={() => setLocalViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Palette
          </Button> */}
          {/* Replace the old create button with the new trigger */}

          <Button
            variant="outline"
            size="lg"
            onClick={() => setImportModalOpen(true)}
            className="max-sm:w-full ml-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Palette
          </Button>

          <ImportPaletteModal
            open={importModalOpen}
            onOpenChange={setImportModalOpen}
          />
          <CreatePaletteTrigger size="lg">
            <span className="mr-2">🎨</span>
            Create Palette
          </CreatePaletteTrigger>
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
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <LayoutGrid className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No palettes found</h3>
          <p className="mb-4 text-muted-foreground">
            {filters.search ||
            filters.tags.length > 0 ||
            filters.showFavoritesOnly
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
              viewMode={localViewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
