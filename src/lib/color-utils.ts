import chroma, { Color as ChromaColor } from "chroma-js";
import { colord } from "colord";
import { Color } from "@/types/palette";
import { nanoidColorId } from "@/constants";

export class ColorUtils {
  static generateRandomColorHex(): string {
    return chroma.random().hex();
  }

  static getContrastRatio(color1: string, color2: string): number {
    return chroma.contrast(color1, color2);
  }

  static getAccessibilityLevel(ratio: number): "fail" | "aa" | "aaa" {
    if (ratio >= 7) return "aaa";
    if (ratio >= 4.5) return "aa";
    return "fail";
  }

  static HexToColor(hex: string): Color {
    return {
      id: nanoidColorId(),
      name: ColorUtils.getColorName(hex),
      hex,
      locked: false,
    };
  }

  static generateShades(color: string, count: number = 9): string[] {
    const baseColor = colord(color);
    const hsl = baseColor.toHsl();
    const shades: string[] = [];

    for (let i = 0; i < count; i++) {
      const lightness = (0.2 + (i / (count - 1)) * 0.7) * 100; // Range from 10% to 90%
      const newColor = colord({ h: hsl.h, s: hsl.s, l: lightness });
      shades.push(newColor.toHex());
    }

    return shades;
  }

  static getColorName(hex: string): string {
    const color = colord(hex);
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
   * @returns The base color, or undefined if the array is empty
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
}
