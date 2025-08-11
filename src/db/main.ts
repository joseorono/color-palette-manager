// src/db/index.ts
import Dexie, { type EntityTable, type Table } from 'dexie';
import { Color, Palette } from '@/types/palette';

const db = new Dexie('ColorPaletteManager') as Dexie & {
  palettes: EntityTable<
    Palette,
    'id'
  >;
  colors: Table<Color>; // Changed to Table since we're using auto-increment
};

db.version(1).stores({
  palettes: '++id, name, createdAt, updatedAt, isPublic, isFavorite, *tags',
  colors: '++id, hex, locked, name, role' // ++id means auto-increment
});

export async function createPalette(palette: Omit<Palette, 'id' | 'createdAt' | 'updatedAt'>) {
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

export { db };