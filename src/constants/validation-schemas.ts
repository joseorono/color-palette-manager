/**
 * Zod schemas for palettes and colors for validation purposes.
 */

import { z } from "zod";

export const colorSchema = z.object({
    hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    name: z.string().min(1).max(48),
    role: z.enum(["primary", "secondary", "accent", "background", "foreground", "muted", "card"]),
    locked: z.boolean().optional().default(false),
});

export const paletteSchema = z.object({
    name: z.string().min(1).max(48),
    description: z.string().min(1).max(256),
    colors: z.array(colorSchema),
    tags: z.array(z.string().min(1).max(48)).optional(),
    isPublic: z.boolean().optional().default(false),
    isFavorite: z.boolean().optional().default(false),
    favoriteCount: z.number().optional().default(0),
});

