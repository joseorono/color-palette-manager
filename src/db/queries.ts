import { Color, Palette } from "@/types/palette";
import { db } from "./main";
import { nanoidPaletteId } from "@/constants/nanoid";

/**
 * Database query operations for palettes and colors.
 * Provides a clean API for CRUD operations with proper type safety.
 */
export class PaletteDBQueries {
  /**
   * Get all palettes from the database
   * @returns Promise<Palette[]> - Array of all palettes
   */
  static async getAllPalettes(): Promise<Palette[]> {
    return await db.palettes.toArray();
  }

  /**
   * Get a palette by its ID
   * @param id - The palette ID
   * @returns Promise<Palette | undefined> - The palette or undefined if not found
   */
  static async getPaletteById(id: string): Promise<Palette | undefined> {
    return await db.palettes.get(id);
  }

  /**
   * Update a palette with new data
   * @param id - The palette ID
   * @param updates - Partial palette data to update
   * @returns Promise<number> - Number of updated records
   */
  static async updatePalette(
    id: string,
    updates: Partial<Omit<Palette, "id" | "createdAt" | "updatedAt">>
  ): Promise<number> {
    const now = new Date();

    return await db.palettes.update(id, {
      ...updates,
      updatedAt: now,
    });
  }

  static async updateMetadataOnly(
    id: string,
    updates: Partial<Omit<Palette, "id" | "createdAt" | "updatedAt" | "colors">>
  ): Promise<number> {
    // The data might be full palette, so we need to filter out the colors
    const now = new Date();
    return await db.palettes.update(id, {
      name: updates.name,
      description: updates.description,
      isPublic: updates.isPublic,
      tags: updates.tags,
      isFavorite: updates.isFavorite,
      updatedAt: now,
    });
  }

  /**
   * Delete a palette by its ID
   * @param id - The palette ID
   * @returns Promise<void>
   */
  static async deletePalette(id: string): Promise<void> {
    return await db.palettes.delete(id);
  }

  /**
   * Insert a new palette into the database
   * @param palette - Palette data without id, createdAt, and updatedAt
   * @returns Promise<string> - The generated palette ID
   */
  static async insertPalette(
    palette: Omit<Palette, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const id = nanoidPaletteId();

    await db.palettes.add({
      ...palette,
      id,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  }

  /**
   * Update the color array of a palette
   * @param id - The palette ID
   * @param colors - The new color array
   * @returns Promise<number | false> - Number of updated records or false if palette not found
   */
  static async updateColors(
    id: string,
    colors: Color[]
  ): Promise<number | false> {
    const queriedPalette = await db.palettes.get(id);
    if (!queriedPalette) {
      return false;
    }
    return await db.palettes.update(id, {
      colors,
    });
  }

  /**
   * Add a color to an existing palette
   * @param id - The palette ID
   * @param color - The color to add
   * @returns Promise<number | false> - Number of updated records or false if palette not found
   */
  static async addColorToPalette(
    id: string,
    color: Color
  ): Promise<number | false> {
    const queriedPalette = await db.palettes.get(id);
    if (!queriedPalette) {
      return false;
    }
    const colors = queriedPalette.colors;
    return await db.palettes.update(id, {
      colors: [...colors, color],
    });
  }

  /**
   * Save a palette - either create new or update existing
   * @param palette - Complete palette data
   * @param existingId - Optional existing palette ID for updates
   * @returns Promise<string> - The palette ID (new or existing)
   */
  static async savePalette(
    palette: Omit<Palette, "id" | "createdAt" | "updatedAt">,
    existingId?: string
  ): Promise<string> {
    if (existingId) {
      // Update existing palette
      await this.updatePalette(existingId, palette);
      return existingId;
    } else {
      // Create new palette
      return await this.insertPalette(palette);
    }
  }
}
