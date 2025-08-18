import { z } from "zod";
import {
  Color,
  Palette,
  colorSchema,
  paletteSchema,
  exportedPaletteJSONSchema
} from "@/types/palette";
import { nanoidColorId, nanoidPaletteId } from "@/constants/nanoid";
import { ColorUtils } from "@/lib/color-utils";

/**
 * Utility class for importing color palettes from various formats.
 */
export class PaletteImport {
  /**
   * Import palette from JSON data exported by PaletteExport.toJSON()
   * @param jsonString - JSON string containing palette data
   * @returns Promise resolving to a Palette object
   * @throws Error if JSON is invalid or doesn't match expected structure
   */
  static async fromJSON(jsonString: string): Promise<Palette> {
    try {
      // Parse and validate JSON using Zod schema
      const rawData = JSON.parse(jsonString);
      const data = exportedPaletteJSONSchema.parse(rawData);

      // Convert exported colors to Color objects with normalized hex values
      const colors: Color[] = data.colors.map((exportedColor) => {
        const color: Color = {
          id: nanoidColorId(),
          hex: ColorUtils.normalizeHex(exportedColor.hex),
          locked: exportedColor.locked,
          name: exportedColor.name || undefined,
        };

        // Validate color using schema (additional safety check)
        return colorSchema.parse(color);
      });

      // Create palette object
      const palette: Palette = {
        id: nanoidPaletteId(),
        name: data.name,
        colors,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: [],
        favoriteCount: 0,
        isFavorite: false,
      };

      // Validate final palette using schema
      return paletteSchema.parse(palette);

    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON format");
      }
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        throw new Error(`Invalid palette data: ${issues}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to import palette: ${error.message}`);
      }
      throw new Error("Unknown error occurred during palette import");
    }
  }

  /**
   * Validate if a JSON string contains valid palette data
   * @param jsonString - JSON string to validate
   * @returns boolean indicating if the JSON contains valid palette data
   */
  static isValidPaletteJSON(jsonString: string): boolean {
    try {
      const rawData = JSON.parse(jsonString);
      exportedPaletteJSONSchema.parse(rawData);
      return true;
    } catch {
      return false;
    }
  }
}
