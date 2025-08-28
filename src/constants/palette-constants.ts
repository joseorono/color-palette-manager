/**
 * Palette generation and validation constants
 */

/**
 * Priority order for color generation in harmonious palettes
 * Controls which types of colors are generated first when creating palettes
 */
export const PALETTE_GENERATION_PRIORITIES = [
  "white",
  "black", 
  "complementary",
  "analogous",
  "variations",
] as const;

/**
 * K-means clustering constants for color extraction
 */
export const KMEANS_CONSTANTS = {
  MAX_ITERATIONS: 10,
  MAX_GENERATION_ATTEMPTS: 100,
} as const;

/**
 * Default palette generation settings
 */
export const PALETTE_DEFAULTS = {
  DEFAULT_COLOR_COUNT: 5,
  MAX_GENERATION_ATTEMPTS: 100,
} as const;

// Type exports
export type PaletteGenerationPriority = typeof PALETTE_GENERATION_PRIORITIES[number];
