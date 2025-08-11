import { Color, Palette } from '@/types/palette';
import { db } from "./main";

/**
 * Database query operations for palettes and colors.
 * Provides a clean API for CRUD operations with proper type safety.
 */
export class PaletteDBQueries {
  /////////**************
  // Palettes
  /////////**************

  /**
   * Insert a new palette into the database
   * @param palette - Palette data without id, createdAt, and updatedAt
   * @returns Promise<string> - The generated palette ID
   */
  static async insertPalette(palette: Omit<Palette, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const id = crypto.randomUUID();

    await db.palettes.add({
      ...palette,
      id,
      createdAt: now,
      updatedAt: now
    });

    return id;
  }

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
  static async updatePalette(id: string, updates: Partial<Omit<Palette, 'id' | 'createdAt'| 'updatedAt'>>): Promise<number> {
    const now = new Date();
    return await db.palettes.update(id, {
      ...updates,
      updatedAt: now
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
   * Add a color to an existing palette
   * @param id - The palette ID
   * @param color - The color to add
   * @returns Promise<number | false> - Number of updated records or false if palette not found
   */
  static async addColorToPalette(id: string, color: Color): Promise<number | false> {
    const queriedColors = await db.palettes.get(id);
    if (!queriedColors) {
      return false;
    }
    const colors = queriedColors.colors;
    return await db.palettes.update(id, {
      colors: [...colors, color]
    });
  }
}
