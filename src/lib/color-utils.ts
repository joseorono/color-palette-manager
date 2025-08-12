import chroma, { Color as ChromaColor } from "chroma-js";
import { colord } from "colord";
import { hsl, lab, differenceEuclidean, random, formatHex } from "culori";
import { Color } from "@/types/palette";
import { nanoidColorId } from "@/constants";

// Constants for color generation and comparison
const PERCEPTUAL_DIFFERENCE_THRESHOLD = 15; // ΔE threshold for fuzzy checking
const ANALOGOUS_HUE_OFFSET = 30; // degrees
const COMPLEMENTARY_HUE_OFFSET = 180; // degrees
const LIGHTNESS_VARIATION_FACTOR = 0.2; // 20% variation
const SATURATION_VARIATION_FACTOR = 0.3; // 30% variation
const WHITE_LIGHTNESS_THRESHOLD = 0.9;
const BLACK_LIGHTNESS_THRESHOLD = 0.1;

export class ColorUtils {
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
   * @returns WCAG accessibility level: "aaa", "aa", or "fail"
   */
  static getAccessibilityLevel(contrastRatio: number): "fail" | "aa" | "aaa" {
    if (contrastRatio >= 7) return "aaa";
    if (contrastRatio >= 4.5) return "aa";
    return "fail";
  }

  /**
   * Convert a hex color string to a Color object
   * @param hexColor - Hex color string (e.g., "#ff5733")
   * @returns Color object with generated ID and name
   */
  static HexToColor(hexColor: string): Color {
    return {
      id: nanoidColorId(),
      name: ColorUtils.getColorName(hexColor),
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
   * Check if a color is perceptually similar to any existing colors using LAB color space
   * @param newColorHex - New color to check in hexadecimal format
   * @param existingColorHexArray - Array of existing colors in hexadecimal format
   * @param threshold - Perceptual difference threshold (default: 15)
   * @returns True if the new color is too similar to any existing color
   */
  static isColorSimilar(
    newColorHex: string,
    existingColorHexArray: string[],
    threshold: number = PERCEPTUAL_DIFFERENCE_THRESHOLD
  ): boolean {
    const newColorLab = lab(newColorHex);
    if (!newColorLab) return false;

    return existingColorHexArray.some(existingColorHex => {
      const existingColorLab = lab(existingColorHex);
      if (!existingColorLab) return false;
      
      const difference = differenceEuclidean()(newColorLab, existingColorLab);
      return difference < threshold;
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
