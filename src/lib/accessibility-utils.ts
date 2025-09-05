import chroma from "chroma-js";
import { colord } from "colord";
import { WCAGContrastLevel } from "@/types/palette";

/**
 * Utility class for accessibility-related color operations and WCAG compliance checking
 */
export class AccessibilityUtils {
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
    const lum1 = AccessibilityUtils.relativeLuminance(color1Hex);
    const lum2 = AccessibilityUtils.relativeLuminance(color2Hex);

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
    return AccessibilityUtils.contrastRatio(hexColor1, hexColor2);
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
    const ratio = AccessibilityUtils.contrastRatio(color1Hex, color2Hex);

    if (level === WCAGContrastLevel.AAA) {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    } else {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    }
  }

  /**
   * Calculate the contrast ratio between two colors using chroma-js
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
   * Get the minimum contrast ratio required for WCAG compliance
   * @param level WCAG level (AA or AAA)
   * @param isLargeText Whether the text is considered large
   * @returns Minimum contrast ratio required
   */
  static getMinimumContrastRatio(
    level: WCAGContrastLevel,
    isLargeText: boolean = false
  ): number {
    if (level === WCAGContrastLevel.AAA) {
      return isLargeText ? 4.5 : 7;
    } else if (level === WCAGContrastLevel.AA) {
      return isLargeText ? 3 : 4.5;
    }
    return 1; // FAIL level has no minimum requirement
  }

  /**
   * Check if a contrast ratio passes a specific WCAG level
   * @param contrastRatio The contrast ratio to check
   * @param level WCAG level to check against
   * @param isLargeText Whether the text is considered large
   * @returns Whether the contrast ratio passes the level
   */
  static passesWCAGLevel(
    contrastRatio: number,
    level: WCAGContrastLevel,
    isLargeText: boolean = false
  ): boolean {
    const minimumRatio = AccessibilityUtils.getMinimumContrastRatio(level, isLargeText);
    return contrastRatio >= minimumRatio;
  }

  /**
   * Get a human-readable description of the WCAG level
   * @param level WCAG level
   * @returns Human-readable description
   */
  static getWCAGLevelDescription(level: WCAGContrastLevel): string {
    switch (level) {
      case WCAGContrastLevel.AAA:
        return "Enhanced accessibility (AAA)";
      case WCAGContrastLevel.AA:
        return "Standard accessibility (AA)";
      case WCAGContrastLevel.FAIL:
        return "Does not meet accessibility standards";
      default:
        return "Unknown level";
    }
  }

  /**
   * Calculate all WCAG compliance results for a color pair
   * @param textColor Text color in hex format
   * @param backgroundColor Background color in hex format
   * @returns Object with all WCAG compliance results
   */
  static getWCAGCompliance(textColor: string, backgroundColor: string) {
    const contrastRatio = AccessibilityUtils.getContrastRatio(textColor, backgroundColor);
    const accessibilityLevel = AccessibilityUtils.getAccessibilityLevel(contrastRatio);

    return {
      contrastRatio,
      accessibilityLevel,
      normalText: {
        aa: AccessibilityUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AA, false),
        aaa: AccessibilityUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AAA, false)
      },
      largeText: {
        aa: AccessibilityUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AA, true),
        aaa: AccessibilityUtils.meetsWCAGContrast(textColor, backgroundColor, WCAGContrastLevel.AAA, true)
      }
    };
  }
}

