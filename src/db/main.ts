// src/db/index.ts
import Dexie, { type EntityTable, type Table } from "dexie";
import { Color, Palette } from "@/types/palette";

const db = new Dexie("ColorPaletteManager") as Dexie & {
  palettes: EntityTable<Palette, "id">;
};

db.version(1).stores({
  palettes:
    "++id, name, description, *colors, createdAt, updatedAt, isPublic, isFavorite, *tags",
});

export { db };
