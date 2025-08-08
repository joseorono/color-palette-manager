import { ExportFormat } from "@/constants/export";

// Roles for colors, like primary, secondary, etc.
/*
  const containerStyle = {
      '--primary': palette.primary,
      '--secondary': palette.secondary,
      '--accent': palette.accent,
      '--background': palette.background,
      '--foreground': palette.foreground,
      '--card': palette.card,
      '--border': palette.border,
      '--muted': palette.muted,
      '--primary-foreground': '0 0% 98%',
      '--secondary-foreground': palette.foreground,
      '--accent-foreground': palette.foreground,
      '--card-foreground': palette.foreground,
      '--muted-foreground': '220 5.9% 57.9%',
    };
*/
export const ColorRoles = [
  "primary",
  "secondary",
  "accent",
  "background",
  "foreground",
  "card",
  "border",
  "muted",
  "primary-foreground",
  "secondary-foreground",
  "accent-foreground",
  "card-foreground",
  "muted-foreground",
] as const;

export type ColorRole = typeof ColorRoles[number];
export type CSSColorVariablesObject = Record<ColorRole, string>;

export interface Color {
  id: string;
  hex: string;
  locked: boolean;
  name?: string;
  role?: ColorRole;
}

export interface Palette {
  id: string;
  name: string;
  description?: string;
  colors: Color[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  favoriteCount?: number;
  isFavorite?: boolean;
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
