import { ExportFormat } from "@/constants/export";

export interface Color {
  id: string;
  hex: string;
  locked: boolean;
  name?: string;
}

export interface Palette {
  id: string
  name: string
  description?: string
  colors: Color[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  tags: string[]
  userId: string
  favoriteCount?: number
  isFavorite?: boolean
}

export interface PaletteExport {
  format: ExportFormat;
  palette: Palette;
}

export interface PaletteFilters {
  search: string
  tags: string[]
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'favoriteCount'
  sortOrder: 'asc' | 'desc'
  showFavoritesOnly: boolean
}

/*
=========================
   Accessibility
=========================
*/

// WCAGContrastLevel, with array for validation
export enum WCAGContrastLevel {
  FAIL = "fail",
  AA = "aa",
  AAA = "aaa",
}

export const WCAGContrastLevels = Object.values(WCAGContrastLevel);

export interface WCAGContrastResult {
  ratio: number;
  level: WCAGContrastLevel;
}
