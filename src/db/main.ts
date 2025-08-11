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

export { db };