import chroma, { Color as ChromaColor } from "chroma-js";
import { colord } from "colord";
import { hsl, rgb, random, formatHex } from "culori";
import { Color, WCAGContrastLevel } from "@/types/palette";
import { nanoidColorId } from "@/constants";

// Constants for color generation and comparison
const ANALOGOUS_HUE_OFFSET = 30; // degrees
const COMPLEMENTARY_HUE_OFFSET = 180; // degrees
const LIGHTNESS_VARIATION_FACTOR = 0.2; // 20% variation
const SATURATION_VARIATION_FACTOR = 0.3; // 30% variation
const WHITE_LIGHTNESS_THRESHOLD = 0.9;
const BLACK_LIGHTNESS_THRESHOLD = 0.1;

export class ColorUtils {

  /**
   * Validate if a string is a valid hex color
   * @param hex - Color string to validate
   * @returns boolean - True if valid hex color
   */
  static isValidHex(hex: string): boolean {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Check if it's 3 or 6 characters and all hex digits
    return /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(cleanHex);
  }

  /**
   * Normalize hex color to full 6-digit format with #
   * @param hex - Hex color string
   * @returns string - Normalized hex color
   */
  static normalizeHex(hex: string): string {
    let cleanHex = hex.replace('#', '').toUpperCase();

    // Expand 3-digit hex to 6-digit
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(char => char + char).join('');
    }

    return `#${cleanHex}`;
  }

  /**
   * Generate a random color in hexadecimal format
   * @returns A random hex color string (e.g., "#ff5733")
   */
  static generateRandomColorHex(): string {
    return chroma.random().hex();
  }

  /**
   * Calculate the contrast ratio between two colors
   * @param color1Hex - First color in hexadecimal format
   * @param color2Hex - Second color in hexadecimal format
   * @returns Contrast ratio between 1 and 21
   */
  static getContrastRatio(color1Hex: string, color2Hex: string): number {
    return chroma.contrast(color1Hex, color2Hex);
  }

  /**
   * Determine WCAG accessibility level based on contrast ratio
   * @param contrastRatio - The contrast ratio to evaluate
   * @returns WCAG accessibility level enum value
   */
  static getAccessibilityLevel(contrastRatio: number): WCAGContrastLevel {
    if (contrastRatio >= 7) return WCAGContrastLevel.AAA;
    if (contrastRatio >= 4.5) return WCAGContrastLevel.AA;
    return WCAGContrastLevel.FAIL;
  }

  /**
   * Convert a hex color string to a Color object
   * @param hexColor - Hex color string (e.g., "#ff5733")
   * @returns Color object with generated ID and name
   */
  static HexToColor(hexColor: string, name?: string): Color {
    return {
      id: nanoidColorId(),
      name: name || ColorUtils.getColorName(hexColor),
      hex: hexColor,
      locked: false,
    };
  }

  /**
   * Generate a series of shades for a given color
   * @param baseColorHex - Base color in hexadecimal format
   * @param count - Number of shades to generate (default: 9)
   * @returns Array of hex color strings representing different lightness levels
   */
  static generateShades(baseColorHex: string, count: number = 9): string[] {
    const baseColor = colord(baseColorHex);
    const hsl = baseColor.toHsl();
    const shades: string[] = [];

    for (let i = 0; i < count; i++) {
      const lightness = (0.2 + (i / (count - 1)) * 0.7) * 100; // Range from 20% to 90%
      const newColor = colord({ h: hsl.h, s: hsl.s, l: lightness });
      shades.push(newColor.toHex());
    }

    return shades;
  }

  /**
   * Generate a human-readable name for a color based on its HSL values
   * @param hexColor - Color in hexadecimal format
   * @returns Human-readable color name (e.g., "Light Blue", "Dark Red")
   */
  static getColorName(hexColor: string): string {
    const color = colord(hexColor);
    const hsl = color.toHsl();

    // Simple color naming based on HSL values
    const hue = hsl.h;
    const saturation = hsl.s;
    const lightness = hsl.l;

    let name = "";

    // Determine base color
    if (saturation < 0.1) {
      if (lightness > 0.9) name = "White";
      else if (lightness < 0.1) name = "Black";
      else name = "Gray";
    } else {
      if (hue < 15 || hue >= 345) name = "Red";
      else if (hue < 45) name = "Orange";
      else if (hue < 75) name = "Yellow";
      else if (hue < 105) name = "Yellow Green";
      else if (hue < 135) name = "Green";
      else if (hue < 165) name = "Green Cyan";
      else if (hue < 195) name = "Cyan";
      else if (hue < 225) name = "Blue";
      else if (hue < 255) name = "Blue Violet";
      else if (hue < 285) name = "Violet";
      else if (hue < 315) name = "Red Violet";
      else name = "Red";
    }

    // Add modifiers
    if (lightness > 0.8) name = `Light ${name}`;
    else if (lightness < 0.3) name = `Dark ${name}`;

    return name;
  }

  /**
   * Get the base color from an array of colors.
   * Returns the primary color (if one exists with "primary" role) or the first color.
   * @param colors - Array of colors to get the base color from
   * @returns The base color, or a random color if the array is empty
   */
  static getBaseColor(colors: Color[]): Color {
    if (colors.length === 0) {
      // Return random color.
      return ColorUtils.HexToColor(ColorUtils.generateRandomColorHex());
    }

    // Look for a color with "primary" role first
    const primaryColor = colors.find(color => color.role === "primary");
    if (primaryColor) {
      return primaryColor;
    }

    // ToDo: If no primary color found, return the first color with some saturation (not black or white)

    // If no color found, return the first color
    return colors[0];
  }

  /**
   * Get the base color hex from an array of hex color strings
   * @param colorHexArray - Array of hex color strings
   * @returns The first color hex, or a random color if array is empty
   */
  static getBaseColorHex(colorHexArray: string[]): string {
    return colorHexArray.length > 0 ? colorHexArray[0] : formatHex(random());
  }
  /**
   * Get the RGB distance between two colors
   * @param color1Hex - First color in hexadecimal format
   * @param color2Hex - Second color in hexadecimal format
   * @returns RGB distance between the two colors
   */
  static getDistanceBetweenColors(color1Hex: string, color2Hex: string): number {
    const color1Rgb = rgb(color1Hex);
    const color2Rgb = rgb(color2Hex);

    if (!color1Rgb || !color2Rgb) return 0;

    const rDiff = (color1Rgb.r || 0) - (color2Rgb.r || 0);
    const gDiff = (color1Rgb.g || 0) - (color2Rgb.g || 0);
    const bDiff = (color1Rgb.b || 0) - (color2Rgb.b || 0);

    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) * 255;
  }

  /**
   * Check if a color is perceptually similar to any existing colors using RGB distance
   * @param newColorHex - New color to check in hexadecimal format
   * @param existingColorHexArray - Array of existing colors in hexadecimal format
   * @param threshold - RGB distance threshold (default: 50)
   * @returns True if the new color is too similar to any existing color
   */
  static isColorSimilar(
    newColorHex: string,
    existingColorHexArray: string[],
    threshold: number = 50
  ): boolean {
    if (existingColorHexArray.length === 0) return false;

    // Use .some() to return early if we find a color that's too similar.
    // If no existing color is too similar, .some() will return false
    return existingColorHexArray.some(existingColorHex => {
      const distance = ColorUtils.getDistanceBetweenColors(newColorHex, existingColorHex);
      return distance < threshold;
    });
  }

  /**
   * Generate a white color variant based on a base color
   * @param baseColorHex - Base color in hexadecimal format
   * @returns White variant hex color string
   */
  static generateWhite(baseColorHex: string): string {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return "#ffffff";

    return formatHex({
      mode: "hsl",
      h: baseHsl.h || 0,
      s: (baseHsl.s || 0) * 0.1, // Very low saturation
      l: WHITE_LIGHTNESS_THRESHOLD
    });
  }

  /**
   * Generate a black color variant based on a base color
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Black variant hex color string
   */
  static generateBlack(baseColorHex: string): string {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return "#000000";

    return formatHex({
      mode: "hsl",
      h: baseHsl.h || 0,
      s: (baseHsl.s || 0) * 0.8, // Maintain some saturation
      l: BLACK_LIGHTNESS_THRESHOLD
    });
  }

  /**
   * Generate complementary color (180° hue shift)
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Complementary color hex string
   */
  static generateComplementary(baseColorHex: string): string {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return baseColorHex;

    return formatHex({
      mode: "hsl",
      h: ((baseHsl.h || 0) + COMPLEMENTARY_HUE_OFFSET) % 360,
      s: baseHsl.s || 0,
      l: baseHsl.l || 0.5
    });
  }

  /**
   * Generate analogous colors (±30° hue shifts)
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Array of two analogous color hex strings
   */
  static generateAnalogous(baseColorHex: string): string[] {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return [];

    return [
      formatHex({
        mode: "hsl",
        h: ((baseHsl.h || 0) + ANALOGOUS_HUE_OFFSET) % 360,
        s: baseHsl.s || 0,
        l: baseHsl.l || 0.5
      }),
      formatHex({
        mode: "hsl",
        h: ((baseHsl.h || 0) - ANALOGOUS_HUE_OFFSET + 360) % 360,
        s: baseHsl.s || 0,
        l: baseHsl.l || 0.5
      })
    ];
  }

  /**
   * Generate color variations (lightness and saturation adjustments)
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Array of four variation hex color strings
   */
  static generateVariations(baseColorHex: string): string[] {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return [];

    const variations: string[] = [];
    const baseLightness = baseHsl.l || 0.5;
    const baseSaturation = baseHsl.s || 0.5;

    // Lightness variations
    const lighterL = Math.min(1, baseLightness + LIGHTNESS_VARIATION_FACTOR);
    const darkerL = Math.max(0, baseLightness - LIGHTNESS_VARIATION_FACTOR);

    variations.push(
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: baseSaturation,
        l: lighterL
      }),
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: baseSaturation,
        l: darkerL
      })
    );

    // Saturation variations
    const higherS = Math.min(1, baseSaturation + SATURATION_VARIATION_FACTOR);
    const lowerS = Math.max(0, baseSaturation - SATURATION_VARIATION_FACTOR);

    variations.push(
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: higherS,
        l: baseLightness
      }),
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: lowerS,
        l: baseLightness
      })
    );

    return variations;
  }
}
