import { Color, Palette, paletteSchema } from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { PaletteDBQueries } from "@/db/queries";
import { nanoidPaletteId, nanoidColorId } from "@/constants";

/**
 * Utility class for handling palette operations via URL parameters.
 * Supports loading palettes from hex CSV, palette IDs, and shareable Base64 URLs.
 */
export class PaletteUrlUtils {
  /**
   * Main entry point for creating a palette from URL parameters.
   * Routes to appropriate method based on URL parameters present.
   * @param urlParams - URLSearchParams object from current URL
   * @returns Promise<Palette | null> - The loaded palette or null if no valid params
   */
  static async paletteFromUrlParams(
    urlParams: URLSearchParams
  ): Promise<Palette | null> {
    try {
      // Check for shareable URL first (highest priority)
      if (urlParams.has("share")) {
        return await this.paletteFromShareableUrl(urlParams.get("share")!);
      }

      // Check for palette ID
      if (urlParams.has("paletteId")) {
        return await this.paletteFromPaletteId(urlParams.get("paletteId")!);
      }

      // Check for base color to generate harmonious palette
      if (urlParams.has("basedOnColor")) {
        return this.paletteFromBaseColor(urlParams.get("basedOnColor")!);
      }

      // Check for hex CSV colors
      if (urlParams.has("colors")) {
        return this.paletteFromHexCsv(urlParams.get("colors")!);
      }

      return null;
    } catch (error) {
      console.error("Error loading palette from URL:", error);
      return null;
    }
  }

  /**
   * Create a harmonious palette from a base color in URL.
   * Example: ?basedOnColor=#ff0000
   * @param baseColorParam - Base color hex string
   * @returns Palette | null - Generated harmonious palette or null if invalid
   */
  static paletteFromBaseColor(baseColorParam: string): Palette | null {
    try {
      if (!baseColorParam || baseColorParam.trim() === "") {
        return null;
      }

      const trimmedColor = baseColorParam.trim();

      // Validate the base color
      if (!ColorUtils.isValidHex(trimmedColor)) {
        return null;
      }

      const normalizedBaseColor = ColorUtils.normalizeHex(trimmedColor);

      // Generate harmonious colors using PaletteUtils
      const harmoniousHexColors = PaletteUtils.generateHarmoniousHexCsv(normalizedBaseColor, 5);

      // Convert to CSV format and use existing paletteFromHexCsv method
      const colorsParam = harmoniousHexColors.join(",");
      const palette = this.paletteFromHexCsv(colorsParam);

      if (palette) {
        // Update the palette name and description to reflect it was generated from base color
        palette.name = `New From ${normalizedBaseColor}`;
        palette.description = `Generated palette from base color ${normalizedBaseColor}`;
      }

      return palette;
    } catch (error) {
      console.error("Error creating palette from base color:", error);
      return null;
    }
  }

  /**
   * Create a palette from comma-separated hex colors in URL.
   * Example: ?colors=#ff0000,#00ff00,#0000ff
   * @param colorsParam - Comma-separated hex color string
   * @returns Palette | null - Generated palette or null if invalid
   */
  static paletteFromHexCsv(colorsParam: string): Palette | null {
    try {
      if (!colorsParam || colorsParam.trim() === "") {
        return null;
      }

      // Split by comma and clean up
      const hexColors = colorsParam
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color.length > 0);

      if (hexColors.length === 0) {
        return null;
      }

      // Validate and normalize hex colors
      const validColors: Color[] = [];
      for (const hex of hexColors) {
        if (ColorUtils.isValidHex(hex)) {
          const normalizedHex = ColorUtils.normalizeHex(hex);
          validColors.push({
            id: nanoidColorId(),
            hex: normalizedHex,
            locked: false,
          });
        }
      }

      if (validColors.length === 0) {
        return null;
      }

      // Create palette with generated colors
      const palette: Palette = {
        id: nanoidPaletteId(),
        name: `URL Palette (${validColors.length} colors)`,
        description: `Generated from URL colors: ${validColors.map((c) => c.hex).join(", ")}`,
        colors: validColors,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: [],
      };

      return palette;
    } catch (error) {
      console.error("Error creating palette from hex CSV:", error);
      return null;
    }
  }

  /**
   * Load an existing palette from the database by ID.
   * Example: ?paletteId=abc123def456
   * @param paletteId - The palette ID to load
   * @returns Promise<Palette | null> - The loaded palette or null if not found
   */
  static async paletteFromPaletteId(
    paletteId: string
  ): Promise<Palette | null> {
    try {
      const trimmedId = paletteId.trim();
      if (!paletteId || trimmedId === "") {
        return null;
      }

      const palette = await PaletteDBQueries.getPaletteById(trimmedId);
      return palette || null;
    } catch (error) {
      console.error("Error loading palette by ID:", error);
      return null;
    }
  }

  /**
   * Checks if the given URL length is safe for all modern browsers
   * (Chrome, Firefox, Edge, Safari, mobile browsers).
   *
   * Conservative limit is ~32KB to avoid Safari copy/paste issues.
   * Returns true if it's safe across the board.
   */
  static isUrlSafeForModernBrowsers(url: string): boolean {
    const MAX_SAFE_LENGTH = 32000; // ~32KB

    try {
      const normalized = new URL(url).toString();
      return normalized.length <= MAX_SAFE_LENGTH;
    } catch {
      // Invalid URL isn't safe
      return false;
    }
  }

  /**
   * Create a palette from a Base64-encoded shareable URL.
   * Example: ?share=eyJuYW1lIjoiTXkgUGFsZXR0ZSIsImNvbG9ycyI6WyIjZmYwMDAwIl19
   * @param shareParam - Base64-encoded palette data
   * @returns Promise<Palette | null> - Decoded palette or null if invalid
   */
  static async paletteFromShareableUrl(
    shareParam: string
  ): Promise<Palette | null> {
    try {
      if (!shareParam || shareParam.trim() === "") {
        return null;
      }

      const decodedPalette = this.decodeShareableUrl(shareParam);
      return decodedPalette;
    } catch (error) {
      console.error("Error loading palette from shareable URL:", error);
      return null;
    }
  }

  /**
   * Generate a URL with hex colors as CSV parameters.
   * @param colors - Array of Color objects
   * @returns string - URL with colors parameter
   */
  static generateHexCsvUrl(colors: Color[]): string {
    const hexColors = colors.map((color) => color.hex).join(",");
    return `/app/palette-edit/?colors=${encodeURIComponent(hexColors)}`;
  }

  /**
   * Generate a URL with palette ID parameter.
   * @param paletteId - The palette ID
   * @returns string - URL with paletteId parameter
   */
  static generatePaletteIdUrl(paletteId: string): string {
    return `/app/palette-edit/?paletteId=${encodeURIComponent(paletteId)}`;
  }

  /**
   * Encode a palette as a Base64 string for shareable URLs.
   * @param palette - The palette to encode
   * @returns string - Base64-encoded palette data
   */
  static encodeShareableUrl(palette: Palette): string {
    try {
      const jsonString = JSON.stringify(palette);
      const base64String = btoa(encodeURIComponent(jsonString));
      if (this.isUrlSafeForModernBrowsers(base64String)) {
        return base64String;
      } else {
        throw new Error("Data too large for sharing.");
      }
    } catch (error) {
      console.error("Error encoding shareable URL:", error);
      throw new Error("Failed to encode palette for sharing");
    }
  }

  /**
   * Decode a Base64 string back to a palette object.
   * @param encodedData - Base64-encoded palette data
   * @returns Palette | null - Decoded palette or null if invalid
   */
  static decodeShareableUrl(encodedData: string): Palette | null {
    try {
      const jsonString = decodeURIComponent(atob(encodedData));
      const rawData = JSON.parse(jsonString);

      // Use Zod schema to validate and parse the data
      const validationResult = paletteSchema.safeParse(rawData);

      if (!validationResult.success) {
        console.warn(
          "Invalid palette data in shareable URL:",
          validationResult.error
        );
        return null;
      }

      // Generate new IDs for the shared palette to avoid conflicts
      const palette: Palette = {
        ...validationResult.data,
        id: nanoidPaletteId(),
        colors: validationResult.data.colors.map((color) => ({
          ...color,
          id: nanoidColorId(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return palette;
    } catch (error) {
      console.error("Error decoding shareable URL:", error);
      return null;
    }
  }

  /**
   * Generate a complete shareable URL for a palette.
   * @param palette - The palette to share
   * @returns string - Relative shareable URL
   */
  static generateShareableUrl(palette: Palette): string {
    const encodedData = this.encodeShareableUrl(palette);
    return `/app/palette-edit/?share=${encodedData}`;
  }
}
