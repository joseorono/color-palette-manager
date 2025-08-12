import { z } from "zod";
import { nanoid } from "nanoid";
import { ExportFormat } from "@/constants/export";
import { COLOR_ID_LENGTH } from "@/constants";

/*
=====================================
    Color Roles and CSS Variables
=====================================
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

/*
=====================================
    Main Types with Zod Schemas
=====================================
*/

export const colorSchema = z.object({
  id: z.string().length(COLOR_ID_LENGTH),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  locked: z.boolean().default(false),
  name: z.string().min(1).max(48).optional(),
  role: z.enum(ColorRoles).optional(),
});
export type Color = z.infer<typeof colorSchema>;

export const paletteSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(48),
  description: z.string().min(1).max(256).optional(),
  colors: z.array(colorSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string().min(1).max(48)).default([]),
  favoriteCount: z.number().default(0).optional(),
  isFavorite: z.boolean().default(false).optional(),
});
export type Palette = z.infer<typeof paletteSchema>;

/*
=====================================
    Misc Interfaces
=====================================
*/

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
=====================================
    Accessibility-Related Types
=====================================
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
