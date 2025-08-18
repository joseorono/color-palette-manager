import { z } from "zod";
import { ExportFormat } from "@/constants/export";
import { COLOR_ID_LENGTH, PALETTE_ID_LENGTH } from "@/constants";

export const indexNumberZod = z.number().int().positive();

export const isLockedFieldZod = z.boolean().default(false);

/** A Hex color string in the format RRGGBB */
export type HexColorString = string;

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

export type ColorRole = (typeof ColorRoles)[number];
export type CSSColorVariablesObject = Record<ColorRole, string>;

/*
=====================================
    Main Types with Zod Schemas
=====================================
*/

export const colorHexRegexZod = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const colorFieldsZod = {
  hex: colorHexRegexZod,
  locked: isLockedFieldZod,
  name: z.string().min(1).max(48).optional(),
  role: z.enum(ColorRoles).optional(),
};

export const colorSchema = z.object({
  id: z.string().length(COLOR_ID_LENGTH),
  ...colorFieldsZod,
});
export type Color = z.infer<typeof colorSchema>;

export const paletteFieldsZod = {
  name: z.string().min(1).max(48),
  description: z.string().min(1).max(256).optional(),
  colors: z.array(colorSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string().min(1).max(48)).default([]),
  favoriteCount: z.number().default(0).optional(),
  isFavorite: z.boolean().default(false).optional(),
};

export const paletteSchema = z.object({
  id: z.string().length(PALETTE_ID_LENGTH),
  ...paletteFieldsZod,
});

export type Palette = z.infer<typeof paletteSchema>;

export const newPaletteFormSchema = z.object({
  name: paletteFieldsZod.name,
  description: paletteFieldsZod.description,
  isPublic: paletteFieldsZod.isPublic,
  tags: paletteFieldsZod.tags,
  isFavorite: paletteFieldsZod.isFavorite,
  baseColor: colorHexRegexZod.optional(),
});

export type NewPaletteFormValues = z.infer<typeof newPaletteFormSchema>;

/*
=====================================
    Export/Import Schemas
=====================================
*/


export const exportedColorFieldsZod = {
  name: z.string().min(1),
  hex: colorHexRegexZod,
  index: indexNumberZod,
  locked: isLockedFieldZod,
};

export const exportedColorSchema = z.object(exportedColorFieldsZod);

export const exportedPaletteFieldsZod = {
  name: z.string().min(1).max(48),
  colors: z.array(exportedColorSchema).min(1),
  createdAt: z.string().datetime().optional(),
  totalColors: z.number().int().positive(),
};

export const exportedPaletteJSONSchema = z.object(exportedPaletteFieldsZod);

/*
=====================================
    Palette-Derived Types
=====================================
*/

export interface PaletteExport {
  format: ExportFormat;
  palette: Palette;
}

// Sort options for palette filtering
export type SortByOption = "name" | "createdAt" | "updatedAt" | "favoriteCount";
export type SortOrderOption = "asc" | "desc";

// View mode options for palette display
export type ViewMode = "grid" | "compact" | "list";

export interface PaletteFilters {
  search: string;
  tags: string[];
  sortBy: SortByOption;
  sortOrder: SortOrderOption;
  showFavoritesOnly: boolean;
}


/*
=====================================
    Image Analysis Types
=====================================
*/
/**
 * Image analysis results
 */
export interface ImageAnalysis {
  pixels: number[][];
  colorFrequency: Map<string, ColorFrequencyData>;
  uniqueColors: number;
  sampledPixels: number;
  colorDiversity: number;
  totalPixels: number;
  samplingRate: number;
}

/**
* Color frequency tracking data
*/
export interface ColorFrequencyData {
  rgb: number[];
  count: number;
  hex: string;
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
