"use client";

import { useState } from "react";
import { Search, Filter, SortAsc, SortDesc, Heart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { PaletteFilters } from "@/types/palette";

interface PaletteFiltersProps {
  filters: PaletteFilters;
  onFiltersChange: (filters: PaletteFilters) => void;
  availableTags: string[];
}

export function PaletteFilters({
  filters,
  onFiltersChange,
  availableTags,
}: PaletteFiltersProps) {
  const [tagSearch, setTagSearch] = useState("");

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !filters.tags.includes(tag)
  );

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      PaletteFilters["sortBy"],
      PaletteFilters["sortOrder"],
    ];
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleRemoveTag = (tag: string) => {
    onFiltersChange({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  };

  const handleFavoritesToggle = () => {
    onFiltersChange({
      ...filters,
      showFavoritesOnly: !filters.showFavoritesOnly,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      tags: [],
      sortBy: "updatedAt",
      sortOrder: "desc",
      showFavoritesOnly: false,
    });
  };

  const hasActiveFilters =
    filters.search || filters.tags.length > 0 || filters.showFavoritesOnly;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search palettes..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 "
          />
        </div>

        {/* Sort */}
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="">
            <div className="flex items-center">
              {filters.sortOrder === "asc" ? (
                <SortAsc className="mr-2 h-4 w-4" />
              ) : (
                <SortDesc className="mr-2 h-4 w-4" />
              )}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
            <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
            <SelectItem value="createdAt-desc">Recently Created</SelectItem>
            <SelectItem value="createdAt-asc">Oldest Created</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="favoriteCount-desc">Most Popular</SelectItem>
            <SelectItem value="favoriteCount-asc">Least Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* Filters */}
        <div className="flex w-auto gap-3">
          <Button
            variant={filters.showFavoritesOnly ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={handleFavoritesToggle}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${filters.showFavoritesOnly ? "fill-current" : ""}`}
            />
            Favorites
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                Tags
                {filters.tags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 p-1.5 text-xs"
                  >
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Filter by Tags</h4>
                  <Input
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {filteredTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <label
                        htmlFor={tag}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2 flex flex-col items-center">
          <div className="flex items-center justify-between">
          <span className="text-sm text-black">Active filters :</span>
          </div>

          {filters.showFavoritesOnly && (
            <Badge variant="secondary" className="flex items-center gap-1 w-auto max-w-fit">
              <Heart className="h-3 w-3 fill-current" />
              Favorites
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={handleFavoritesToggle}
              />
            </Badge>
          )}

          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 w-auto max-w-fit hover:bg-secondary/80"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}

          <Button variant="ghost" size="sm" className="max-sm:w-[150px] max-sm:mt-2" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
