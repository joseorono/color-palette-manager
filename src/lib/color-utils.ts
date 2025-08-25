import chroma, { Color as ChromaColor } from "chroma-js";
import { colord } from "colord";
import { hsl, rgb, random, formatHex } from "culori";
import { Color, HexColorString, WCAGContrastLevel } from "@/types/palette";
import { COLOR_NAME_DATABASE } from "@/constants/palettes-and-colors";
import { nanoidColorId } from "@/constants/nanoid";
import {
  ANALOGOUS_HUE_OFFSET,
  COMPLEMENTARY_HUE_OFFSET,
  LIGHTNESS_VARIATION_FACTOR,
  SATURATION_VARIATION_FACTOR,
  WHITE_LIGHTNESS_THRESHOLD,
  BLACK_LIGHTNESS_THRESHOLD,
  LIGHTNESS_DESCRIPTORS,
  SATURATION_DESCRIPTORS,
} from "@/constants/color-constants";


export class ColorUtils {
  /*
  ======================================
          Clamping & Normalization
  ======================================
  */

  /**
   * Clamps a value between a minimum and maximum range.
   * @param value The value to clamp.
   * @param min The minimum allowed value.
   * @param max The maximum allowed value.
   * @returns The clamped value.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Normalizes a value from one range to another.
   * @param value The value to normalize.
   * @param fromMin The minimum of the source range.
   * @param fromMax The maximum of the source range.
   * @param toMin The minimum of the target range.
   * @param toMax The maximum of the target range.
   * @returns The normalized value.
   */
  static normalize(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
    const normalized = (value - fromMin) / (fromMax - fromMin);
    return toMin + normalized * (toMax - toMin);
  }

  /**
   * Wraps a value around a maximum (useful for hue values).
   * @param value The value to wrap.
   * @param max The maximum value before wrapping.
   * @returns The wrapped value.
   */
  static wrap(value: number, max: number): number {
    return ((value % max) + max) % max;
  }

  /*
  ======================================
          Color Space Calculations
  ======================================
  */

  /**
   * Linear interpolation between two colors in HSL space.
   * @param color1Hex First color in hex format.
   * @param color2Hex Second color in hex format.
   * @param t Interpolation factor (0-1).
   * @returns Interpolated color in hex format.
   */
  static lerpColors(color1Hex: string, color2Hex: string, t: number): string {
    const color1 = colord(color1Hex).toHsl();
    const color2 = colord(color2Hex).toHsl();
    
    // Handle hue interpolation (shortest path around the color wheel)
    let h1 = color1.h;
    let h2 = color2.h;
    
    if (Math.abs(h2 - h1) > 180) {
      if (h2 > h1) {
        h1 += 360;
      } else {
        h2 += 360;
      }
    }
    
    const interpolatedH = h1 + (h2 - h1) * ColorUtils.clamp(t, 0, 1);
    const interpolatedS = color1.s + (color2.s - color1.s) * ColorUtils.clamp(t, 0, 1);
    const interpolatedL = color1.l + (color2.l - color1.l) * ColorUtils.clamp(t, 0, 1);
    
    const normalizedH = ColorUtils.wrap(interpolatedH, 360);
    const normalizedS = ColorUtils.clamp(interpolatedS, 0, 1);
    const normalizedL = ColorUtils.clamp(interpolatedL, 0, 1);
    
    return colord({ h: normalizedH, s: normalizedS, l: normalizedL }).toHex();
  }

  /**
   * Calculates the Euclidean distance between two colors in RGB space.
   * @param color1Hex First color in hex format.
   * @param color2Hex Second color in hex format.
   * @returns Distance value (0-441.67).
   */
  static colorDistance(color1Hex: string, color2Hex: string): number {
    const color1 = colord(color1Hex).toRgb();
    const color2 = colord(color2Hex).toRgb();
    
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  /*
  ======================================
          Harmony Calculations
  ======================================
  */

  /**
   * Calculates the complementary hue (opposite on color wheel).
   * @param hue The base hue in degrees (0-360).
   * @returns The complementary hue.
   */
  static complementaryHue(hue: number): number {
    return ColorUtils.wrap(hue + 180, 360);
  }

  /**
   * Generates analogous hues around a base hue.
   * @param baseHue The base hue in degrees (0-360).
   * @param count The number of analogous hues to generate.
   * @param spread The spread angle in degrees (default: 30).
   * @returns Array of analogous hues.
   */
  static analogousHues(baseHue: number, count: number, spread: number = 30): number[] {
    const hues: number[] = [];
    const step = spread / Math.max(count - 1, 1);
    const startHue = baseHue - spread / 2;
    
    for (let i = 0; i < count; i++) {
      hues.push(ColorUtils.wrap(startHue + i * step, 360));
    }
    
    return hues;
  }

  /**
   * Calculates triadic harmony hues (120° apart).
   * @param baseHue The base hue in degrees (0-360).
   * @returns Array of three triadic hues.
   */
  static triadicHues(baseHue: number): number[] {
    return [
      baseHue,
      ColorUtils.wrap(baseHue + 120, 360),
      ColorUtils.wrap(baseHue + 240, 360)
    ];
  }

  /**
   * Calculates tetradic harmony hues (90° apart).
   * @param baseHue The base hue in degrees (0-360).
   * @returns Array of four tetradic hues.
   */
  static tetradicHues(baseHue: number): number[] {
    return [
      baseHue,
      ColorUtils.wrap(baseHue + 90, 360),
      ColorUtils.wrap(baseHue + 180, 360),
      ColorUtils.wrap(baseHue + 270, 360)
    ];
  }

  /**
   * Calculates split complementary hues.
   * @param baseHue The base hue in degrees (0-360).
   * @param splitAngle The angle to split from complement (default: 30).
   * @returns Array of split complementary hues.
   */
  static splitComplementaryHues(baseHue: number, splitAngle: number = 30): number[] {
    const complement = ColorUtils.complementaryHue(baseHue);
    return [
      baseHue,
      ColorUtils.wrap(complement - splitAngle, 360),
      ColorUtils.wrap(complement + splitAngle, 360)
    ];
  }

  /*
  ======================================
          Contrast & Accessibility
  ======================================
  */

  /**
   * Calculates the relative luminance of a color according to WCAG guidelines.
   * @param hexColor Color in hex format.
   * @returns Relative luminance value (0-1).
   */
  static relativeLuminance(hexColor: string): number {
    const rgb = colord(hexColor).toRgb();
    
    // Convert to linear RGB
    const toLinear = (value: number): number => {
      const normalized = value / 255;
      return normalized <= 0.03928 
        ? normalized / 12.92 
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };
    
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    
    // WCAG formula for relative luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculates the contrast ratio between two colors according to WCAG guidelines.
   * @param color1Hex First color in hex format.
   * @param color2Hex Second color in hex format.
   * @returns Contrast ratio (1-21).
   */
  static contrastRatio(color1Hex: string, color2Hex: string): number {
    const lum1 = ColorUtils.relativeLuminance(color1Hex);
    const lum2 = ColorUtils.relativeLuminance(color2Hex);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Convenience method to get contrast ratio with hex colors.
   * @param hexColor1 First color in hex format.
   * @param hexColor2 Second color in hex format.
   * @returns Contrast ratio (1-21).
   */
  static hexContrastRatio(hexColor1: string, hexColor2: string): number {
    return ColorUtils.contrastRatio(hexColor1, hexColor2);
  }

  /**
   * Checks if two colors meet WCAG contrast requirements.
   * @param color1Hex First color in hex format.
   * @param color2Hex Second color in hex format.
   * @param level WCAG level (AA or AAA).
   * @param isLargeText Whether the text is considered large (default: false).
   * @returns Whether the contrast meets the specified level.
   */
  static meetsWCAGContrast(
    color1Hex: string, 
    color2Hex: string, 
    level: WCAGContrastLevel = WCAGContrastLevel.AA, 
    isLargeText: boolean = false
  ): boolean {
    const ratio = ColorUtils.contrastRatio(color1Hex, color2Hex);
    
    if (level === WCAGContrastLevel.AAA) {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    } else {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    }
  }

  /**
   * Check if a color is considered white based on lightness threshold
   * @param hexColor - Color in hexadecimal format
   * @returns True if the color is considered white
   */
  static isWhiteColor(hexColor: string): boolean {
    const hsl = colord(hexColor).toHsl();
    return hsl.l > WHITE_LIGHTNESS_THRESHOLD && hsl.s < 0.1;
  }

  /**
   * Check if a color is considered black based on lightness threshold
   * @param hexColor - Color in hexadecimal format
   * @returns True if the color is considered black
   */
  static isBlackColor(hexColor: string): boolean {
    const hsl = colord(hexColor).toHsl();
    return hsl.l < BLACK_LIGHTNESS_THRESHOLD;
  }

  /**
   * Check if a color is considered grayscale (low saturation)
   * @param hexColor - Color in hexadecimal format
   * @returns True if the color is grayscale
   */
  static isGrayscaleColor(hexColor: string): boolean {
    const hsl = colord(hexColor).toHsl();
    return hsl.s < 0.1;
  }

  /**
   * Calculate perceptual color distance using Delta E CIE76 formula
   * More accurate than RGB distance for color similarity
   * @param color1Hex - First color in hexadecimal format
   * @param color2Hex - Second color in hexadecimal format
   * @returns Delta E distance (0 = identical, >100 = very different)
   */
  static getPerceptualColorDistance(
    color1Hex: string,
    color2Hex: string
  ): number {
    try {
      // Use chroma.js deltaE function for perceptual color distance
      return chroma.deltaE(color1Hex, color2Hex);
    } catch {
      // Fallback to RGB distance if deltaE fails
      return (
        (ColorUtils.getDistanceBetweenColors(color1Hex, color2Hex) / 255) * 100
      );
    }
  }

  /**
   * Find the nearest named color from the color database
   * @param hexColor - Color to find nearest match for
   * @returns Object with the nearest color name and distance
   */
  static findNearestNamedColor(hexColor: string): {
    name: string;
    distance: number;
  } {
    const normalizedHex = ColorUtils.normalizeHex(hexColor);

    // Check for exact match first
    if (COLOR_NAME_DATABASE[normalizedHex]) {
      return { name: COLOR_NAME_DATABASE[normalizedHex], distance: 0 };
    }

    let nearestName = "Unknown";
    let minDistance = Infinity;

    // Find the closest color in the database using perceptual distance
    for (const [dbHex, dbName] of Object.entries(COLOR_NAME_DATABASE)) {
      const distance = ColorUtils.getPerceptualColorDistance(
        normalizedHex,
        dbHex
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestName = dbName;
      }
    }

    return { name: nearestName, distance: minDistance };
  }

  /**
   * Generate descriptive color name based on HSL properties
   * @param hexColor - Color in hexadecimal format
   * @returns Descriptive color name with modifiers
   */
  static generateDescriptiveName(hexColor: string): string {
    const hsl = colord(hexColor).toHsl();
    const { h: hue, s: saturation, l: lightness } = hsl;

    // Handle grayscale colors
    if (ColorUtils.isGrayscaleColor(hexColor)) {
      if (ColorUtils.isWhiteColor(hexColor)) return "White";
      if (ColorUtils.isBlackColor(hexColor)) return "Black";

      if (lightness > 0.8) return "Light Gray";
      if (lightness > 0.6) return "Gray";
      if (lightness > 0.4) return "Dark Gray";
      return "Very Dark Gray";
    }

    // Determine base hue name with more precise ranges
    let baseName = "";
    if (hue >= 345 || hue < 15) baseName = "Red";
    else if (hue < 25) baseName = "Red Orange";
    else if (hue < 45) baseName = "Orange";
    else if (hue < 65) baseName = "Yellow Orange";
    else if (hue < 85) baseName = "Yellow";
    else if (hue < 105) baseName = "Yellow Green";
    else if (hue < 125) baseName = "Green";
    else if (hue < 145) baseName = "Blue Green";
    else if (hue < 165) baseName = "Cyan";
    else if (hue < 185) baseName = "Light Blue";
    else if (hue < 205) baseName = "Blue";
    else if (hue < 225) baseName = "Blue Violet";
    else if (hue < 245) baseName = "Violet";
    else if (hue < 265) baseName = "Purple";
    else if (hue < 285) baseName = "Red Violet";
    else if (hue < 305) baseName = "Magenta";
    else if (hue < 325) baseName = "Pink";
    else baseName = "Red";

    // Add lightness modifiers
    let lightnessModifier = "";
    if (lightness > 0.85) lightnessModifier = LIGHTNESS_DESCRIPTORS.VERY_LIGHT;
    else if (lightness > 0.7) lightnessModifier = LIGHTNESS_DESCRIPTORS.LIGHT;
    else if (lightness < 0.2)
      lightnessModifier = LIGHTNESS_DESCRIPTORS.VERY_DARK;
    else if (lightness < 0.35) lightnessModifier = LIGHTNESS_DESCRIPTORS.DARK;

    // Add saturation modifiers for very saturated or muted colors
    let saturationModifier = "";
    if (saturation > 0.9) saturationModifier = SATURATION_DESCRIPTORS.VERY_HIGH;
    else if (saturation > 0.7) saturationModifier = SATURATION_DESCRIPTORS.HIGH;
    else if (saturation < 0.3) saturationModifier = SATURATION_DESCRIPTORS.LOW;
    else if (saturation < 0.15)
      saturationModifier = SATURATION_DESCRIPTORS.VERY_LOW;

    // Combine modifiers with base name
    const modifiers = [saturationModifier, lightnessModifier].filter(Boolean);
    return modifiers.length > 0
      ? `${modifiers.join(" ")} ${baseName}`
      : baseName;
  }
  /**
   * Validate if a string is a valid hex color
   * @param hex - Color string to validate
   * @returns boolean - True if valid hex color
   */
  static isValidHex(hex: HexColorString): boolean {
    // Remove # if present
    const cleanHex = hex.replace("#", "");

    // Check if it's 3 or 6 characters and all hex digits
    return /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(cleanHex);
  }

  /**
   * Normalize hex color to full 6-digit format with #
   * @param hex - Hex color string
   * @returns string - Normalized hex color
   */
  static normalizeHex(hex: string): string {
    let cleanHex = hex.replace("#", "").toUpperCase();

    // Expand 3-digit hex to 6-digit
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split("")
        .map((char) => char + char)
        .join("");
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
   * Convert a hex color string to an HSL string
   * @param hexColor - Hex color string (e.g., "#ff5733")
   * @returns HSL string (e.g., "220 90% 56%")
   */
  static hexToHsl(hexColor: HexColorString): string {
    const hsl = colord(hexColor).toHsl();
    return `${hsl.h} ${hsl.s * 100}% ${hsl.l * 100}%`;
  }

  /**
   * Convert a hex color string to a Color object
   * @param hexColor - Hex color string (e.g., "#ff5733")
   * @returns Color object with generated ID and name
   */
  static HexToColor(hexColor: string, name?: string, locked?: boolean): Color {
    return {
      id: nanoidColorId(),
      name: name || ColorUtils.getColorName(hexColor),
      hex: hexColor,
      locked: locked || false,
    };
  }

  /**
   * Convert a hex color string to an RGB object
   * @param hexColor - Hex color string (e.g., "#ff5733")
   * @returns RGB object with r, g, and b properties
   */

  static HextoRgb(hexColor: string): { r: number; g: number; b: number } {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return { r, g, b };
  }

  /**
   * Generate a series of shades for a given color
   * @param baseColorHex - Base color in hexadecimal format
   * @param count - Number of shades to generate (default: 9)
   * @returns Array of hex color strings representing different lightness levels
   */
  static generateShades(
    baseColorHex: string,
    count: number = 9
  ): HexColorString[] {
    const baseColor = colord(baseColorHex);
    const hsl = baseColor.toHsl();
    const shades: HexColorString[] = [];

    for (let i = 0; i < count; i++) {
      const lightness = (0.2 + (i / (count - 1)) * 0.7) * 100; // Range from 20% to 90%
      const newColor = colord({ h: hsl.h, s: hsl.s, l: lightness });
      shades.push(newColor.toHex());
    }

    return shades;
  }

  /**
   * Generate a human-readable name for a color using advanced color matching
   * Combines nearest-color matching with descriptive fallback naming
   * @param hexColor - Color in hexadecimal format
   * @returns Human-readable color name (e.g., "Crimson", "Light Blue", "Muted Green")
   */
  static getColorName(hexColor: string): string {
    try {
      // First, try to find the nearest named color from our database
      const { name: nearestName, distance } =
        ColorUtils.findNearestNamedColor(hexColor);

      // If the color is very close to a named color (Delta E < 15), use the named color
      // Delta E < 15 is generally considered imperceptible to most people
      if (distance < 15) {
        return nearestName;
      }

      // If the color is reasonably close (Delta E < 30), use the named color with a modifier
      // This helps provide familiar color names while acknowledging the difference
      if (distance < 30) {
        const descriptiveName = ColorUtils.generateDescriptiveName(hexColor);

        // If the descriptive name is very different from the nearest name, use descriptive
        // Otherwise, use the nearest name as it's more recognizable
        if (
          descriptiveName.toLowerCase().includes(nearestName.toLowerCase()) ||
          nearestName.toLowerCase().includes(descriptiveName.toLowerCase())
        ) {
          return nearestName;
        }
      }

      // For colors that don't match well with named colors, use descriptive naming
      return ColorUtils.generateDescriptiveName(hexColor);
    } catch (error) {
      // Fallback to descriptive naming if anything goes wrong
      console.warn("Error in getColorName:", error);
      return ColorUtils.generateDescriptiveName(hexColor);
    }
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
    const primaryColor = colors.find((color) => color.role === "primary");
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
  static getBaseColorHex(colorHexArray: HexColorString[]): string {
    return colorHexArray.length > 0 ? colorHexArray[0] : formatHex(random());
  }
  /**
   * Get the RGB distance between two colors
   * @param color1Hex - First color in hexadecimal format
   * @param color2Hex - Second color in hexadecimal format
   * @returns RGB distance between the two colors
   */
  static getDistanceBetweenColors(
    color1Hex: string,
    color2Hex: string
  ): number {
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
    existingColorHexArray: HexColorString[],
    threshold: number = 50
  ): boolean {
    if (existingColorHexArray.length === 0) return false;

    // Use .some() to return early if we find a color that's too similar.
    // If no existing color is too similar, .some() will return false
    return existingColorHexArray.some((existingColorHex) => {
      const distance = ColorUtils.getDistanceBetweenColors(
        newColorHex,
        existingColorHex
      );
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
      l: WHITE_LIGHTNESS_THRESHOLD,
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
      l: BLACK_LIGHTNESS_THRESHOLD,
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
      l: baseHsl.l || 0.5,
    });
  }

  /**
   * Generate analogous colors (±30° hue shifts)
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Array of two analogous color hex strings
   */
  static generateAnalogous(baseColorHex: string): HexColorString[] {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return [];

    return [
      formatHex({
        mode: "hsl",
        h: ((baseHsl.h || 0) + ANALOGOUS_HUE_OFFSET) % 360,
        s: baseHsl.s || 0,
        l: baseHsl.l || 0.5,
      }),
      formatHex({
        mode: "hsl",
        h: ((baseHsl.h || 0) - ANALOGOUS_HUE_OFFSET + 360) % 360,
        s: baseHsl.s || 0,
        l: baseHsl.l || 0.5,
      }),
    ];
  }

  /**
   * Generate color variations (lightness and saturation adjustments)
   * @param baseColorHex - Base color in hexadecimal format
   * @returns Array of four variation hex color strings
   */
  static generateVariations(baseColorHex: string): HexColorString[] {
    const baseHsl = hsl(baseColorHex);
    if (!baseHsl) return [];

    const variations: HexColorString[] = [];
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
        l: lighterL,
      }),
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: baseSaturation,
        l: darkerL,
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
        l: baseLightness,
      }),
      formatHex({
        mode: "hsl",
        h: baseHsl.h || 0,
        s: lowerS,
        l: baseLightness,
      })
    );

    return variations;
  }

  /**
   * Find a color by its ID and return both the color and its index
   * @param colors - Array of colors to search
   * @param id - Color ID to find
   * @returns Object with color and index, or null if not found
   */
  static findColorById(
    colors: Color[],
    id: string
  ): { color: Color; index: number } | null {
    const index = colors.findIndex((color) => color.id === id);
    if (index === -1) return null;
    return { color: colors[index], index };
  }

  /**
   * Get the index of a color by its ID
   * @param colors - Array of colors to search
   * @param id - Color ID to find
   * @returns Index of the color, or -1 if not found
   */
  static getColorIndex(colors: Color[], id: string): number {
    return colors.findIndex((color) => color.id === id);
  }
}
