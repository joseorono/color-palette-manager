import { Color } from "@/types/palette";
import { nanoidColorId } from "@/constants/nanoid";

/**
 * Utilities for parsing and validating palette data from URLs
 */
export class PaletteUrlParser {
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
   * Parse colors from URL search parameters
   * @param searchParams - URLSearchParams object
   * @returns ParsedColors - Object with valid colors and errors
   */
  static parseColorsFromUrl(searchParams: URLSearchParams): {
    validColors: string[];
    invalidColors: string[];
    totalCount: number;
  } {
    const colorsParam = searchParams.get('colors');
    
    if (!colorsParam) {
      return {
        validColors: [],
        invalidColors: [],
        totalCount: 0
      };
    }

    const colorStrings = colorsParam.split(',').map(c => c.trim());
    const validColors: string[] = [];
    const invalidColors: string[] = [];

    colorStrings.forEach(colorStr => {
      if (this.isValidHex(colorStr)) {
        validColors.push(this.normalizeHex(colorStr));
      } else {
        invalidColors.push(colorStr);
      }
    });

    return {
      validColors,
      invalidColors,
      totalCount: colorStrings.length
    };
  }

  /**
   * Convert hex colors to Color objects for the palette store
   * @param hexColors - Array of hex color strings
   * @returns Color[] - Array of Color objects
   */
  static hexColorsToColorObjects(hexColors: string[]): Color[] {
    return hexColors.map(hex => ({
      id: nanoidColorId(),
      hex: this.normalizeHex(hex),
      locked: false,
    }));
  }

  /**
   * Generate shareable URL with current palette colors
   * @param colors - Array of Color objects
   * @param baseUrl - Base URL (defaults to current origin)
   * @returns string - Shareable URL
   */
  static generateShareableUrl(colors: Color[], baseUrl?: string): string {
    const base = baseUrl || window.location.origin;
    const hexColors = colors.map(c => c.hex.replace('#', ''));
    return `${base}/editor?colors=${hexColors.join(',')}`;
  }

  /**
   * Validate and parse a complete URL for palette data
   * @param url - Full URL string
   * @returns ParsedUrlData - Comprehensive parsing result
   */
  static parseFullUrl(url: string): {
    isValid: boolean;
    paletteId?: string;
    colors: {
      validColors: string[];
      invalidColors: string[];
      totalCount: number;
    };
    route: 'landing' | 'dashboard' | 'editor-new' | 'editor-edit' | 'unknown';
    errors: string[];
  } {
    const errors: string[] = [];
    let route: 'landing' | 'dashboard' | 'editor-new' | 'editor-edit' | 'unknown' = 'unknown';
    let paletteId: string | undefined;

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;

      // Determine route
      if (pathname === '/') {
        route = 'landing';
      } else if (pathname === '/dashboard') {
        route = 'dashboard';
      } else if (pathname === '/editor') {
        route = 'editor-new';
      } else if (pathname.startsWith('/editor/')) {
        route = 'editor-edit';
        paletteId = pathname.replace('/editor/', '');
        
        // Validate palette ID format (nanoid)
        if (!/^[A-Za-z0-9_-]{21}$/.test(paletteId)) {
          errors.push(`Invalid palette ID format: ${paletteId}`);
        }
      }

      // Parse colors
      const colors = this.parseColorsFromUrl(searchParams);
      
      if (colors.invalidColors.length > 0) {
        errors.push(`Invalid colors found: ${colors.invalidColors.join(', ')}`);
      }

      return {
        isValid: errors.length === 0,
        paletteId,
        colors,
        route,
        errors
      };
    } catch (error) {
      errors.push(`Invalid URL format: ${error}`);
      
      return {
        isValid: false,
        colors: {
          validColors: [],
          invalidColors: [],
          totalCount: 0
        },
        route: 'unknown',
        errors
      };
    }
  }

  /**
   * Clean and validate URL parameters for palette editor
   * @param searchParams - URLSearchParams to clean
   * @returns URLSearchParams - Cleaned parameters
   */
  static cleanUrlParams(searchParams: URLSearchParams): URLSearchParams {
    const cleaned = new URLSearchParams();
    
    // Only preserve valid color parameters
    const { validColors } = this.parseColorsFromUrl(searchParams);
    
    if (validColors.length > 0) {
      const cleanedColors = validColors.map(hex => hex.replace('#', ''));
      cleaned.set('colors', cleanedColors.join(','));
    }

    return cleaned;
  }
}
