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

/**
 * Hue name mappings for color naming
 * Maps hue ranges (0-360 degrees) to descriptive color names
 */
export const HUE_NAMES = {
  0: "Red",        // 345-15
  15: "Red Orange", // 15-25
  25: "Orange",     // 25-45
  45: "Yellow Orange", // 45-65
  65: "Yellow",     // 65-85
  85: "Yellow Green", // 85-105
  105: "Green",     // 105-125
  125: "Blue Green", // 125-145
  145: "Cyan",      // 145-165
  165: "Light Blue", // 165-185
  185: "Blue",      // 185-205
  205: "Blue Violet", // 205-225
  225: "Violet",    // 225-245
  245: "Purple",    // 245-265
  265: "Red Violet", // 265-285
  285: "Magenta",   // 285-305
  305: "Pink",      // 305-325
  325: "Red",       // 325-345
} as const;


/**
 * Color distance thresholds for perceptual matching
 */
export const COLOR_DISTANCE_THRESHOLDS = {
  EXACT_MATCH: 0,
  IMPERCEPTIBLE: 15,    // Delta E < 15 is generally imperceptible
  REASONABLE_MATCH: 30, // Delta E < 30 is a reasonable match
} as const;

// Type exports for the descriptors
export type LightnessDescriptor = typeof LIGHTNESS_DESCRIPTORS[keyof typeof LIGHTNESS_DESCRIPTORS];
export type SaturationDescriptor = typeof SATURATION_DESCRIPTORS[keyof typeof SATURATION_DESCRIPTORS];
export type HueName = typeof HUE_NAMES[keyof typeof HUE_NAMES];
