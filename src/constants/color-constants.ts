/**
 * Color generation and comparison constants
 */

// Harmony calculation constants
export const ANALOGOUS_HUE_OFFSET = 30; // degrees
export const COMPLEMENTARY_HUE_OFFSET = 180; // degrees

// Color variation factors
export const LIGHTNESS_VARIATION_FACTOR = 0.25; // 25% variation
export const SATURATION_VARIATION_FACTOR = 0.35; // 35% variation

// Color detection thresholds
export const WHITE_LIGHTNESS_THRESHOLD = 0.95;
export const BLACK_LIGHTNESS_THRESHOLD = 0.05;

/**
 * Lightness descriptors for color naming
 */
export const LIGHTNESS_DESCRIPTORS = {
  VERY_LIGHT: "Pale",
  LIGHT: "Light",
  MEDIUM_LIGHT: "",
  MEDIUM: "",
  MEDIUM_DARK: "",
  DARK: "Dark",
  VERY_DARK: "Deep",
} as const;

/**
 * Saturation descriptors for color naming
 */
export const SATURATION_DESCRIPTORS = {
  VERY_LOW: "Grayish",
  LOW: "Muted",
  MEDIUM: "",
  HIGH: "Vivid",
  VERY_HIGH: "Bright",
} as const;

// Type exports for the descriptors
export type LightnessDescriptor = typeof LIGHTNESS_DESCRIPTORS[keyof typeof LIGHTNESS_DESCRIPTORS];
export type SaturationDescriptor = typeof SATURATION_DESCRIPTORS[keyof typeof SATURATION_DESCRIPTORS];
