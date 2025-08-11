import { Color, Palette } from '@/types/palette';
import { db } from "./main";

/////////**************
// Palettes
/////////**************

export async function insertPalette(palette: Omit<Palette, 'id' | 'createdAt' | 'updatedAt'>) {
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

// Helper function to get all palettes
export async function getAllPalettes(): Promise<Palette[]> {
    return await db.palettes.toArray();
}

// Helper function to get palette by id
export async function getPaletteById(id: string): Promise<Palette | undefined> {
    return await db.palettes.get(id);
}

// Helper function to update a palette
export async function updatePalette(id: string, updates: Partial<Omit<Palette, 'id' | 'createdAt'| 'updatedAt'>>) {
    const now = new Date();
    return await db.palettes.update(id, {
      ...updates,
      updatedAt: now
    });
  }

  // Helper function to delete a palette
  export async function deletePalette(id: string) {
    return await db.palettes.delete(id);
  }

  export async function addColorToPalette(id: string, color: Color) {
    const queriedColors = await db.palettes.get(id);
    if (!queriedColors) {
      return false;
    }
    const colors = queriedColors.colors;
    return await db.palettes.update(id,
      { colors: [...colors, color] }
    );
  }
