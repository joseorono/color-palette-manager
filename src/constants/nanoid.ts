import { customAlphabet } from "nanoid";

export const COLOR_ID_LENGTH = 6;
export const PALETTE_ID_LENGTH = 12;

// Use alphanumeric characters for IDs so we can use them in URLs without encoding
export const ID_DICTIONARY =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const nanoidColorId = customAlphabet(ID_DICTIONARY, COLOR_ID_LENGTH);
export const nanoidPaletteId = customAlphabet(ID_DICTIONARY, PALETTE_ID_LENGTH);
