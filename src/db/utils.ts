import { Color, Palette } from '@/types/palette';
import { db } from "./main";


/////////**************
// Palettes
/////////**************

// Helper function to get all palettes
export async function getAllPalettes() {
    return await db.palettes.toArray();
  }
  
  // Helper function to get palette by id
  export async function getPaletteById(id: string) {
    return await db.palettes.get(id);
  }
  
  // Helper function to update a palette
  export async function updatePalette(id: string, updates: Partial<Omit<Palette, 'id' | 'createdAt'>>) {
    return await db.palettes.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  }
  
  // Helper function to delete a palette
  export async function deletePalette(id: string) {
    return await db.palettes.delete(id);
  }
  
  /////////**************
  // Colors
  /////////**************
  
  // Helper function to get all colors
  export async function getAllColors() {
    return await db.colors.toArray();
  }
  
  // Helper function to get color by id
  export async function getColorById(id: string) {
    return await db.colors.get(id);
  }
  
  // Helper function to update a color
  export async function updateColor(id: string, updates: Partial<Omit<Color, 'id'>>) {
    return await db.colors.update(id, updates);
  }
  
  // Helper function to delete a color
  export async function deleteColor(id: string) {
    return await db.colors.delete(id);
  }
  