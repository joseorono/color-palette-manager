import type { Palette } from "@/types/palette";
import { PaletteUrlUtils } from "./palette-url-utils";
import { ShareOptions, ShareResult } from "@/types/share";

/**
 * Utility class for sharing palettes with multiple sharing strategies
 */
export class ShareUtils {
  /**
   * Generate editor-style URL with hex colors as query parameters
   * Uses existing PaletteUrlUtils for consistency
   * @param palette - The palette to share
   * @returns string - Editor URL with colors parameter
   */
  static generateEditorUrl(palette: Palette): string {
    if (!palette?.colors?.length) return window.location.origin;
    return `${window.location.origin}${PaletteUrlUtils.generateHexCsvUrl(palette.colors)}`;
  }

  /**
   * Generate database-style URL with palette ID
   * Uses existing PaletteUrlUtils for consistency
   * @param paletteId - The palette ID
   * @returns string - URL with palette ID parameter
   */
  static generatePaletteIdUrl(paletteId: string): string {
    return `${window.location.origin}${PaletteUrlUtils.generatePaletteIdUrl(paletteId)}`;
  }

  /**
   * Copy URL to clipboard with error handling
   * @param url - URL to copy
   * @param customMessage - Optional custom success message
   * @returns Promise<ShareResult>
   */
  static async copyUrlToClipboard(
    url: string,
    customMessage?: string
  ): Promise<ShareResult> {
    try {
      await navigator.clipboard.writeText(url);
      return {
        success: true,
        method: 'clipboard',
        message: customMessage || "URL copied to clipboard!"
      };
    } catch (error) {
      return {
        success: false,
        method: 'error',
        message: "Failed to copy URL"
      };
    }
  }

  /**
   * Share palette using Web Share API with clipboard fallback
   * @param palette - The palette to share
   * @param options - Share configuration options
   * @returns Promise<ShareResult>
   */
  static async sharePalette(
    palette: Palette,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    const {
      title = "Check out this color palette!",
      text = `I created this beautiful color palette with ${palette?.colors?.length || 0} colors. Take a look!`,
      successMessage = "Palette shared successfully!",
      fallbackMessage = "Device doesn't support sharing, copying URL instead!"
    } = options;

    const url = this.generateEditorUrl(palette);

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return {
          success: true,
          method: 'native',
          message: successMessage
        };
      } catch (error) {
        // User cancelled or sharing failed, fallback to copy URL
        if (error instanceof Error && error.name !== "AbortError") {
          return await this.copyUrlToClipboard(url, fallbackMessage);
        }
        return {
          success: false,
          method: 'error',
          message: "Share cancelled"
        };
      }
    } else {
      // Fallback to copy URL if Web Share API not supported
      return await this.copyUrlToClipboard(url, fallbackMessage);
    }
  }

  /**
   * Copy palette colors as comma-separated hex values
   * @param palette - The palette to copy colors from
   * @returns Promise<ShareResult>
   */
  static async copyPaletteColors(palette: Palette): Promise<ShareResult> {
    try {
      const colorString = palette.colors.map((color) => color.hex).join(", ");
      await navigator.clipboard.writeText(colorString);
      return {
        success: true,
        method: 'clipboard',
        message: "Colors copied to clipboard!"
      };
    } catch (error) {
      return {
        success: false,
        method: 'error',
        message: "Failed to copy colors"
      };
    }
  }

  /**
   * Copy shareable palette URL (for saved palettes)
   * @param paletteId - The palette ID
   * @returns Promise<ShareResult>
   */
  static async copyPaletteUrl(paletteId: string): Promise<ShareResult> {
    const url = this.generatePaletteIdUrl(paletteId);
    return await this.copyUrlToClipboard(url, "Palette link copied to clipboard!");
  }
}
